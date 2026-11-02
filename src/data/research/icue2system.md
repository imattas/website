---
author: "Ian Mattas"
pubDatetime: 2026-11-02
title: "iCUE2SYSTEM"
description: "An analysis of how path-based client trust and a caller-selected package root let a standard user cross the privilege boundary in the assessed Corsair iCUE 5.52.93 update service."
type: "Vulnerability analysis"
identifier: "CVE: not assigned"
tags:
  - research
  - windows
  - privilege-escalation
  - corsair-icue
---

## What it is

This is a local privilege-boundary failure in the Corsair iCUE update service. In the iCUE 5.52.93 installation I assessed, a standard local user could influence package operations handled by a service running as `NT AUTHORITY\SYSTEM`. My proof of concept reproduced a fixed identity-check command at SYSTEM integrity.

The important issue is the trust relationship between the user-facing iCUE process, the privileged update service, and package metadata. The service's client check relied on the executable path, while its package manager accepted a package root selected by the client. Those choices allowed user-controlled package data to reach a privileged execution path.

## How the behavior works

The assessed update service exposes a local Qt Remote Objects endpoint over a named pipe. To decide whether a client is acceptable, it checks the process executable path against the iCUE product directory. That can identify a process launched from the expected location, but it does not establish that the process is controlled by a trusted principal: an ordinary user can run code inside their own, non-elevated iCUE process while its executable still has that path.

After connecting, the client can select an installation directory for package operations. The service then uses package metadata from that selected root. When the root and metadata are writable by the standard user, the user can shape the action data consumed by the privileged package manager. The issue is therefore a chain of authorization and trust-boundary errors: path is used as a proxy for caller identity, and user-controlled package state is consumed by a SYSTEM-level component.

The project PoC exercises that chain with a private package-data copy and a narrowly fixed identity check. It also resolves the service methods from runtime metadata instead of relying on hard-coded method numbers. These details describe the assessed build and PoC; they do not establish compatibility with other iCUE releases.

## Why it matters

A local privilege escalation can let a person who already has a standard account gain the authority of the machine's SYSTEM service. That can undermine the separation between ordinary user activity and administrative control of the Windows host. The demonstration requires iCUE to have already been installed and the user to be able to run code locally; it does not demonstrate remote access or exploitation before installation.

I reproduced the result on 2026-10-25 and observed the proof output identify `NT AUTHORITY\SYSTEM`, SID `S-1-5-18`, at System Mandatory Level. I did not test earlier or later product versions, so this finding should be scoped to the assessed release rather than generalized to all iCUE versions.

## Affected component and conditions

- **Product / component:** Corsair iCUE 5 Software, `iCUEUpdateService`
- **Assessed release:** iCUE 5.52.93; service binary version 5.52.93.0
- **Required configuration:** iCUE and its update service already installed
- **Attacker prerequisites:** Ability to run ordinary code as a local, default-integrity user

## Technical details

The service's path check answers “where was this process image loaded from?” rather than “which user and integrity level is making this request, and may they perform this operation?” The distinction matters when code executes inside a user-owned process located in a protected application directory. A path can identify the application binary, but it does not authenticate the authority or intent of every caller using that process.

The package-root choice creates a second trust problem. A privileged package manager should not use action metadata from a location the requesting user can modify. In the assessed flow, package actions from a user-writable root reached the service's privileged package operation. The resulting privilege crossing depends on both conditions: accepted requests from a user-controlled process and privileged consumption of untrusted package state.

The tested proof used a copied registry file rather than changing the installed registry. The report records that the installed copy remained byte-identical during its reproduction. This limits the reported test's impact on the installed package state, but does not change the authorization flaw it demonstrates.

## Demonstration

The public project contains a Windows proof of concept and a detailed description of the test environment. In the reported reproduction, a standard local account triggered the service path and the resulting fixed identity check recorded SYSTEM as the executing identity.

**Observed result:** The proof output identified `NT AUTHORITY\SYSTEM`, SID `S-1-5-18`, with System Mandatory Level.

**Expected result:** The update service should authorize the caller and validate package metadata using trusted identity and ownership checks before starting any privileged package action.

Download the [iCUE2SYSTEM proof-of-concept source](/icue2system.poc.cpp "download:poc.cpp") from this site.

## Security impact and severity

The demonstrated impact is fixed command execution at LocalSystem integrity from a standard local-user starting point, on the one assessed release. This is a meaningful local privilege escalation.

- **Severity:** High impact local privilege escalation
- **CVSS score:** 7.8 (High, provisional)
- **CVSS vector:** `CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H`
- **CWE:** CWE-863 CWE-829

## Mitigation and fix

The service should authenticate the connecting user's token and authorize each privileged operation using the caller's identity, session, and integrity level. Executable path can be an additional signal, but should not be treated as the caller's security identity.

The privileged package manager should use a fixed, canonical package root that is writable only by SYSTEM or Administrators. Before execution, it should validate package metadata ownership and permissions, verify its authenticity, reject reparse-point escapes, and constrain executable actions to trusted locations. Validation and execution should use the same server-side operation state to prevent a path or package from changing between checks.

These are remediation recommendations based on the observed trust boundaries.

| Date (UTC) | Coordination event |
| --- | --- |
| 2026-10-25 | Local reproduction performed and SYSTEM identity result observed |
| 2026-10-26 | Disclosed to Corsair |
| 2026-10-28 | Resolved by Corsair |
| 2026-10-28 | Disclosed to public |
## References

- [Download the iCUE2SYSTEM proof-of-concept source](/icue2system.poc.cpp "download:poc.cpp")
