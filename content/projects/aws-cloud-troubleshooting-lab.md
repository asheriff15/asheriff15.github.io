---
title: AWS Cloud Troubleshooting Lab
summary: Built a VPC and EC2 environment from scratch, then broke it twice and fixed it — a security group outage and a missing-credentials problem solved with a least-privilege IAM role.
stack: [VPC, EC2, Security Groups, IAM, S3]
repo: https://github.com/asheriff15/AWS-Cloud-Security-Lab
highlight: 2 break/fix scenarios
order: 1
---

## What I built

A small but complete AWS environment in us-east-2: a custom VPC (`10.0.0.0/16`), a public subnet (`10.0.1.0/24`), an internet gateway, a route table with a default route to the gateway, a security group that only allows SSH from my own IP, and a `t3.micro` Amazon Linux 2023 instance.

![Route table with the default route to the internet gateway](/projects/aws-troubleshooting/07-route-table.png)

![Security group allowing SSH from a single /32 address](/projects/aws-troubleshooting/09-security-group-created.png)

## Break/fix 1: SSH stops working

| | |
|---|---|
| **Break** | Deleted the only inbound rule from the security group |
| **Symptom** | `ssh: connect to host … port 22: Operation timed out` |
| **Diagnosis** | A *timeout*, not "connection refused". Packets were being silently dropped before reaching the instance — a firewall problem, not an SSH problem |
| **Fix** | Re-added inbound SSH from my IP `/32`, and the connection came straight back |

![The security group with no inbound rules](/projects/aws-troubleshooting/15-inbound-rule-removed.png)

![SSH timing out](/projects/aws-troubleshooting/16-ssh-timeout.png)

![SSH reconnected after restoring the rule](/projects/aws-troubleshooting/18-ssh-reconnected.png)

## Break/fix 2: the instance can't reach S3

Running `aws s3 ls` on the instance returned `Unable to locate credentials`. The network was fine; this was an **identity** problem. The instance had no IAM role, so the CLI had nothing to sign requests with.

The tempting fix is `aws configure` and pasting access keys onto the server. Instead I created an IAM role, `lab-s3-role`, trusted by `ec2.amazonaws.com` with `AmazonS3ReadOnlyAccess`, and attached it to the instance. The CLI now picks up short-lived credentials from instance metadata, and no secrets live on the box.

![S3 failing with no credentials](/projects/aws-troubleshooting/19-s3-no-credentials.png)

![Attaching the IAM role to the instance](/projects/aws-troubleshooting/21-iam-role-attached.png)

## Proving least privilege

A fix isn't verified until you test what *should* fail. Creating a bucket from the instance returned `AccessDenied`, while listing buckets worked. The role can read and nothing more.

![CreateBucket denied for the read-only role](/projects/aws-troubleshooting/22-s3-createbucket-denied.png)

## What I'd do in production

- Remove SSH entirely and use **Systems Manager Session Manager** — no open port 22, no key pairs
- Scope the IAM policy to a **single bucket** instead of read access to all of S3
- Define the whole environment in **Terraform** so it's reproducible and reviewable — the next version of this project
