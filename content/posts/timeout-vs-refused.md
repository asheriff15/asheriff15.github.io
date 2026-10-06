---
title: "Timeout vs. refused: what an SSH error tells you before you change anything"
summary: Two error messages that look alike point to completely different layers. Reading them correctly saves a lot of guessing.
date: 2026-10-06
---

When SSH to an EC2 instance fails, it's tempting to start changing things: restart the instance, regenerate the key, open the security group to the world. The error message usually tells you where to look first.

## The two errors

```text
ssh: connect to host 3.x.x.x port 22: Operation timed out
ssh: connect to host 3.x.x.x port 22: Connection refused
```

They look similar. They mean very different things.

**Connection refused** means your packet *reached* the machine, and the machine answered "nothing is listening on that port." The network path is fine. The problem is on the host: `sshd` isn't running, it's listening on a different port, or a host firewall is rejecting the connection.

**Operation timed out** means your packet never got an answer at all. Something along the way dropped it silently. In AWS, that almost always means one of:

- a **security group** with no inbound rule for port 22 from your IP
- a **network ACL** blocking the traffic in, or blocking the reply on the way out
- a **route table** with no route to an internet gateway
- an instance with **no public IP**

## Why AWS gives you a timeout

Security groups don't send a rejection when they block something; they just drop the packet. That's deliberate: a silent drop gives a scanner nothing to learn. The cost is that from the outside a blocked port looks the same as a machine that doesn't exist.

## Testing it

In my [troubleshooting lab](/projects/aws-cloud-troubleshooting-lab/) I deleted the only inbound rule from the instance's security group. SSH immediately started timing out, even though the instance and `sshd` were running fine. Re-adding the rule for my IP `/32` fixed it instantly. There's no restart needed, because security group changes apply right away.

## The checklist I use now

1. **Timeout?** Start at the network: security group → NACL → route table → public IP.
2. **Refused?** Start at the host: is `sshd` running, on which port, and is a local firewall rejecting the connection?
3. Change **one thing** at a time, and re-test after each change.

Reading the error before reaching for a fix is the cheapest troubleshooting step there is.
