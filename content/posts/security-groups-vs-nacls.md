---
title: "Security groups vs. NACLs: why my site went down when nothing was blocked"
summary: A custom network ACL took my web server offline even though the inbound rules looked right. The reason is one word, stateless.
date: 2026-10-05
---

AWS gives you two network firewalls: **security groups** and **network ACLs**. They look alike in the console, with rules, ports and sources, and it's easy to assume they behave the same way. They don't, and one lab made that very clear.

## The setup

A web server in a public subnet, with a security group allowing HTTP. The page loaded fine. Then I created a custom NACL, associated it with the subnet, and added inbound rules.

The page stopped loading, even though the security group hadn't changed.

## The reason: stateful vs. stateless

A **security group is stateful.** When it allows a request in, it remembers that connection and automatically allows the response back out. You only ever think about one direction.

A **network ACL is stateless.** It judges every packet on its own, with no memory of the connection. Your browser's request comes in on port 80, but the server's response goes back *out* to your browser's **ephemeral port**, a random high port between 1024 and 65535. If the NACL has no outbound rule allowing that, the response gets dropped.

My custom NACL had inbound rules, but outbound it only had the default `*` rule, which is **deny all**. Requests got in; responses couldn't get out. From the browser it just looked like a timeout.

## Side by side

| | Security group | Network ACL |
|---|---|---|
| Applies to | An instance (its network interface) | An entire subnet |
| Remembers connections? | Yes, stateful | No, stateless |
| Rule types | Allow only | Allow and deny |
| How rules are read | All at once | Lowest number first, first match wins |
| A new custom one | Denies inbound, allows outbound | Denies everything |

## When to use which

- **Security groups** for the fine-grained rules: this instance accepts HTTPS from the load balancer, SSH from nowhere.
- **NACLs** as a coarse, subnet-wide guardrail, for example an explicit **deny** for a known-bad IP range across every instance in the subnet at once. Security groups can't express a deny.

And whenever you write an inbound NACL rule, write the outbound ephemeral-port rule right after it.
