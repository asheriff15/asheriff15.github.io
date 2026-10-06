---
title: AWS Security Fundamentals
summary: Four labs on the two layers that secure every AWS account — identity and network — each one tested by proving what the control blocks.
stack: [IAM, Security Groups, Network ACLs, EC2]
repo: https://github.com/asheriff15/aws-security-fundamentals
highlight: 4 labs, identity to network
order: 3
---

## The pattern

Every lab follows the same rule: configure a control, then test it by trying something that **should fail**.

## 1. IAM users

Created an IAM user with MFA and the `ReadOnlyAccess` policy, then signed in as that user and tried to create another user. Denied, because nothing granted `iam:CreateUser`. IAM denies by default.

![CreateUser denied for the read-only user](/projects/security-fundamentals/01-iam-users/03-createuser-denied.png)

## 2. IAM groups

Added the same user to a group with `AdministratorAccess`. The action that failed in lab 1 now succeeded, with group membership as the only change. Permissions are the union of every policy that applies.

![The group with AdministratorAccess](/projects/security-fundamentals/02-iam-groups/02-group-created.png)

## 3. Security groups

Launched an Apache web server allowing SSH and HTTP. Removing the HTTP rule took the site offline with `ERR_TIMED_OUT` while Apache kept running; restoring the rule brought it back. A timeout means a firewall is dropping packets.

![Site timing out after the HTTP rule was removed](/projects/security-fundamentals/03-security-groups/05-site-timeout.png)

## 4. Network ACLs

Built a VPC, subnet, gateway and route table, then attached a custom NACL to the subnet. The site went down even though the security group still allowed it. NACLs are **stateless**, so return traffic needs its own outbound rule.

![The custom NACL associated with the subnet](/projects/security-fundamentals/04-network-acls/04-nacl-rules-updated.png)

## Security groups vs. NACLs

| | Security group | Network ACL |
|---|---|---|
| Applies to | Instance | Whole subnet |
| State | Stateful — replies allowed automatically | Stateless — replies need a rule |
| Rules | Allow only | Allow and deny |
| Evaluation | All rules together | Lowest number first, first match wins |
