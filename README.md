<div align="center">

# Probus - Network Scanner

[![codecov](https://codecov.io/github/royrusso/probus/graph/badge.svg?token=B972KDOOOB)](https://codecov.io/github/royrusso/probus)
![Tests](https://img.shields.io/github/actions/workflow/status/royrusso/probus/pytests_codecov.yml?label=Tests)
![License](https://img.shields.io/badge/license-Apache%202.0-blue?style=flat-square)

**This project is in early development!**

A network scanner with an attractive UI, that identifies security vulnerabilities in your network and alerts you to new ones as they arise. Scans are performed on a schedule or on-demand.

[Introduction](#bulb-introduction) _ [Key Features](#dart-key-features) _ [Quickstart](#zap-quickstart) _ [Development](#dizzy-development) _ [Contributing](#+1-contributing) \* [Contact](#incoming_envelope-contact)

</div>

## :dart: Key Features:

- **Network Scanner:** Asynchronously scans your network for hosts and open ports.
- **Scheduled Scans:** Scans your network on a schedule.
- **Vulnerability Scanner:** Identifies security vulnerabilities in your network on a per-device basis.
- **Scan and Vulnerability History:** Keeps a history of scans and vulnerabilities identified.
- **Alerting:** Alerts you to new vulnerabilities as they arise, new devices added to your network, given a network range.
- **Platform agnostic**: Avilable as a docker container.

## :zap: Quickstart

In order to run the commands described below, you need:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Running

1. Linux Installs: Run `docker compose up` to start the application.
2. Mac and Windows Installs: Run `NETWORK_MODE=bridge docker compose up` to start the application.

UI: [http://localhost:8080](http://localhost:8080)

API: [http://localhost:8000/docs](http://localhost:8000/docs)

> **Note:** The `NETWORK_MODE=bridge` environment variable is required for Mac and Windows. This is because the default network mode for Docker Compose is `host`, which is not supported on Mac and Windows and Probus requires access to the host network to scan the network.

Alternatively, you can create a `.env` file in the root of the project with the following content:

```bash
NETWORK_MODE=bridge
```

## :dizzy: Development

Please read the [DEVELOPMENT.md](DEVELOPMENT.md) file for more information on how to run this project locally and contribute.

## :+1: Contributing

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information on how to contribute to this project.

## :incoming_envelope: Contact

- Use **GitHub Issues** for code-related issues.

## :file_cabinet: License

Probus is licensed under the [Apache License 2.0](LICENSE).
