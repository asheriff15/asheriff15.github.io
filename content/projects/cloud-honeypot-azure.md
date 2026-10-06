---
title: Cloud Honeypot on Azure
summary: Deployed T-Pot on an internet-exposed Azure VM and captured 253 real attacks in the first hour, then traced them by source, service and CVE in Kibana.
stack: [Azure, NSG, T-Pot, Elastic / Kibana, Suricata]
repo: https://github.com/asheriff15/Cloud-Honeypot-Azure
highlight: 253 attacks in the first hour
order: 2
---

## What I built

An Ubuntu 24.04 VM (Standard D2s v3) in Azure's West Europe region running **T-Pot 24.04.1**, a multi-honeypot platform that pulls 160 container images including Cowrie, Dionaea, Honeytrap and Suricata, with everything logged into Elastic and Kibana.

![T-Pot installation pulling 160 images](/projects/honeypot/tpot-install.png)

## Separating the attack surface from the management path

The interesting design problem is exposing almost every port to the internet while keeping the admin interfaces private. The Network Security Group:

| Priority | Rule | Port | Source |
|---|---|---|---|
| 100 | Allow honeypot traffic | 1–64294 | Any |
| 150 | Allow T-Pot web UI | 64297 | My IP only |
| 200 | Allow admin SSH | 64295 | My IP only |
| 300 | Deny public SSH | 64295 | Any |

Because NSG rules are evaluated lowest number first, my admin rule at 200 matches before the deny at 300, and everyone else hits the deny.

## What came in

Within the first hour the sensors logged **253 attacks**.

![Live attack map](/projects/honeypot/attack-map.png)

![Kibana dashboard broken down by honeypot](/projects/honeypot/kibana-dashboard.png)

| Finding | Detail |
|---|---|
| Most targeted honeypot | Honeytrap (164 hits) |
| SSH brute force | Cowrie captured 36 attempts |
| Top source ASN | Google LLC AS396982 (113 hits — cloud-hosted scanners) |
| CVEs probed | CVE-2002-0013, CVE-2024-14007 |
| Top Suricata alert | ET DROP DShield Block Listed Source (59 hits) |
| Passwords tried | "trader", "trading", "ubuntu" |

![Suricata signatures and CVE probes](/projects/honeypot/kibana-cve.png)

## Takeaways

- Exposed services get found within **minutes**, mostly by automated scanners running on major cloud providers
- Attackers lean on default and context-guessed credentials, so the hostname and service shape what they try
- Correlating Suricata signatures with known block lists separates known-bad sources from new ones
