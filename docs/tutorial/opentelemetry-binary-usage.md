---
id: opentelemetry-binary-usage-in-virtual-machine
title: OpenTelemetry Binary Usage in Virtual Machine
description: Using OpenTelemetry binary usage and monitor the virtual machine (VM).
hide_table_of_contents: true
---

import HostMetrics from '../shared/hostmetrics-list.md'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### Overview

This tutorial shows how you can deploy OpenTelemetry binary as an agent, which
collects telemetry data. Data such as traces, metrics and logs generated
by applications most likely running in the same virtual machine (VM).

It can also be used for collecting data from other VMs in the same cluster,
data center or region, however binary is not recommended in that scenerio but
container or deployment which can be easily scaled.

In this guide, you will also learn to set up hostmetrics receiver to collect
metrics from the VM and view in SigNoz.

<Tabs>
<TabItem value="cloud" label="SigNoz Cloud" default>

## Setup Otel Collector as agent

OpenTelemetry-instrumented applications in a VM can send data to the `otel-binary` agent running in the same VM. The OTel agent can then be configured to send data to the SigNoz cloud.

<figure data-zoomable align='center'>
    <img src="/img/docs/saas-docs/vm-setup-2x.webp" alt="Collecting data from applications deployed in VM"/>
    <figcaption><i>OpenTelemetry-instrumented applications in a VM can send data to otel-binary which then sends data to SigNoz cloud.</i></figcaption>
</figure>

<br></br>

Here are the steps to set up OpenTelemetry binary as an agent.

1. Download otel-collector tar.gz

   ```bash
   wget https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/v0.79.0/otelcol-contrib_0.79.0_linux_amd64.tar.gz
   ```

2. Extract otel-collector tar.gz to a folder
   
   ```bash
   mkdir otelcol-contrib && tar xvzf otelcol-contrib_0.79.0_linux_amd64.tar.gz -C otelcol-contrib/
   ```

3. Create `config.yaml` in folder `otelcol-contrib` with the below content in it. Replace `SIGNOZ_API_KEY` with what is provided by SigNoz:

 ```YAML
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
  hostmetrics:
    collection_interval: 60s
    scrapers:
      cpu: {}
      disk: {}
      load: {}
      filesystem: {}
      memory: {}
      network: {}
      paging: {}
      process:
        mute_process_name_error: true
        mute_process_exe_error: true
        mute_process_io_error: true
      processes: {}
  prometheus:
    config:
      global:
        scrape_interval: 60s
      scrape_configs:
        - job_name: otel-collector-binary
          static_configs:
            - targets: ['localhost:8888']
processors:
  batch:
    send_batch_size: 1000
    timeout: 10s
  # Ref: https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/resourcedetectionprocessor/README.md
  resourcedetection:
    detectors: [env, system] # Before system detector, include ec2 for AWS, gcp for GCP and azure for Azure.
    # Using OTEL_RESOURCE_ATTRIBUTES envvar, env detector adds custom labels.
    timeout: 2s
    system:
      hostname_sources: [os] # alternatively, use [dns,os] for setting FQDN as host.name and os as fallback
extensions:
  health_check: {}
  zpages: {}
exporters:
// highlight-start
  otlp:
    endpoint: "ingest.{region}.signoz.cloud:443"
    tls:
      insecure: false
    headers:
      "signoz-access-token": "<SIGNOZ_API_KEY>"
// highlight-end
  logging:
    verbosity: normal
service:
  telemetry:
    metrics:
      address: 0.0.0.0:8888
  extensions: [health_check, zpages]
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
    metrics/internal:
      receivers: [prometheus, hostmetrics]
      processors: [resourcedetection, batch]
      exporters: [otlp]
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
  ```

  Depending on the choice of your region for SigNoz cloud, the otlp endpoint will vary according to this table.

  | Region	| Endpoint |
  | --- | --- |
  | US | ingest.us.signoz.cloud:443 |
  | IN | ingest.in.signoz.cloud:443 |
  | EU | ingest.eu.signoz.cloud:443 |


4. Run otel-collector agent
 ```bash
./otelcol-contrib --config ./config.yaml &> otelcol-output.log & echo "$!" > otel-pid
 ```

4. To view last 50 lines of `otelcol` logs:
 ```bash
tail -f -n 50 otelcol-output.log
 ```

5. To stop `otelcol`:

 ```bash
kill "$(< otel-pid)"
 ```

Application Instrumentation → Otel-Binary Agent in Same VM → SigNoz Saas

<!-- ## Example Java Instrumentation

1. Download otel java binary

 ```bash
wget https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar
 ```

2. Run application

 ```bash
OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4317" \
OTEL_RESOURCE_ATTRIBUTES=service.name=javaApp \
java -javaagent:/path/to/opentelemetry-javaagent.jar -jar target/spring-petclinic-2.4.5.jar
 ``` -->

<!-- ## Dockerized Application Instrumentation

For dockerized applications, we can use the same otel binary agent running in the same VM.

1. Use `extra_hosts` in `docker-compose.yaml` to add `otel-binary` agent as a host:

 ```YAML
  extra_hosts:
    - "otel-binary:host-gateway"
 ```


2. Instrument applications and update Dockerfile(s). Refer to [instrumentation docs](/docs/instrumentation/overview/).

3. Use `OTEL_EXPORTER_OTLP_ENDPOINT` envvar to point to `otel-binary` agent:
 
 ```YAML
  environment:
    - OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-binary:4317
  ...
  
 ``` -->

## Test Sending Traces

OpenTelemetry collector binary should be able to forward all types of telemetry data recevied:
traces, metrics, and logs, to SigNoz OTLP endpoint via gRPC.

Let's send sample traces to the `otelcol` using `telemetrygen`.

To install telemetrygen binary:

```bash
go install github.com/open-telemetry/opentelemetry-collector-contrib/cmd/telemetrygen@latest
```

To send trace data using `telemetrygen`, execute the command below:

```bash
telemetrygen traces --traces 1 --otlp-endpoint localhost:4317 --otlp-insecure
```

Output should look like this:

```
...
2023-03-15T11:04:38.967+0545    INFO    channelz/funcs.go:340   [core][Channel #1] Channel Connectivity change to READY {"system": "grpc", "grpc_log": true}
2023-03-15T11:04:38.968+0545    INFO    traces/traces.go:124    generation of traces isn't being throttled
2023-03-15T11:04:38.968+0545    INFO    traces/worker.go:90     traces generated        {"worker": 0, "traces": 1}
2023-03-15T11:04:38.969+0545    INFO    traces/traces.go:87     stop the batch span processor
2023-03-15T11:04:38.983+0545    INFO    channelz/funcs.go:340   [core][Channel #1] Channel Connectivity change to SHUTDOWN      {"system": "grpc", "grpc_log": true}
2023-03-15T11:04:38.984+0545    INFO    channelz/funcs.go:340   [core][Channel #1 SubChannel #2] Subchannel Connectivity change to SHUTDOWN     {"system": "grpc", "grpc_log": true}
2023-03-15T11:04:38.984+0545    INFO    channelz/funcs.go:340   [core][Channel #1 SubChannel #2] Subchannel deleted     {"system": "grpc", "grpc_log": true}
2023-03-15T11:04:38.984+0545    INFO    channelz/funcs.go:340   [core][Channel #1] Channel deleted      {"system": "grpc", "grpc_log": true}
2023-03-15T11:04:38.984+0545    INFO    traces/traces.go:79     stopping the exporter
```

If the SigNoz endpoint in the configuration is set correctly and accessible,
you should be able to see the traces sent via OpenTelemetry collector in VM
from `telemetrygen` in the SigNoz UI.

![traces generated by telemetrygen][2]


</TabItem>

<TabItem value="self-host" label="Self-Host">

## Prerequisites

- SigNoz application up and running
- SigNoz endpoint accessible from the VM
- availability of ports: `4317`, `4318`, `8888`, `1777`, `13133`

## Installation

You can obtain OpenTelemetry collector binary in the assets of each releases:
[open-telemetry/opentelemetry-collector-releases/releases][1].
There are two ways of installation with binary release assets: `deb` as
`systemd` and `tar.gz` as plain binary.

### Systemd

Using `deb` file, OpenTelemetry Collector will be installed as a `systemd` and
default configuration prepopulated at `/etc/otelcol-contrib` path. This method
would be preferable in case you want the OpenTelemetry collector to always be
running in the background.

To download `deb` file of release version `0.79.0`:

```bash
wget https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/v0.79.0/otelcol-contrib_0.79.0_linux_amd64.deb
```

:::info
In case of different OpenTelemetry collector version, replace `0.79.0` with respective version.
:::

To install `otelcol` as `systemd` using `dpkg`:

```bash
sudo dpkg -i otelcol-contrib_0.79.0_linux_amd64.deb
```

### Plain Binary

Using `tar.gz` release asset, we can extract the OpenTelemetry collector binary
and default configuration at our desired path. We can run the binary directly
with flags either use `tmux

To download `tar.gz` file of release version `0.79.0`:

```bash
wget https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/v0.79.0/otelcol-contrib_0.79.0_linux_amd64.tar.gz
```

:::info
In case of different OpenTelemetry collector version, replace `0.79.0` with respective version.
:::

To create `otelcol` folder and extract files from `tar.gz` to newly created folder:

```bash
mkdir otelcol-contrib && tar xvzf otelcol-contrib_0.79.0_linux_amd64.tar.gz -C otelcol-contrib/
```

## OpenTelemetry Collector Configuration

Let's download standalone configuration for `otelcol` binary running in the VM:

```bash
wget https://raw.githubusercontent.com/SigNoz/benchmark/main/docker/standalone/config.yaml
```

Replace `<IP of machine hosting SigNoz>` with the address to SigNoz in configuration
highlighted below:

```yaml {3}
exporters:
   otlp:
     endpoint: "<IP of machine hosting SigNoz>:4317"
     tls:
       insecure: true
```

In the configuration above, we enable three receivers: `OTLP`, `hostmetrics`
and `prometheus`.

`OTLP` receiver is configured to receive all types of telemetry data:
traces, metrics and logs. These data would be forwarded to SigNoz via
OTLP gRPC endpoint.

`hostmetrics` receiver is configured to collect various metrics of the virtual
machine. It consists of metrics related to CPU, memory, disk, file system,
network, and others.

`prometheus` receiver is configured to collect the internal metrics of the
`otelcol`. You can update it as per your need to include additional scrape
targets accessible from the VM or remove existing targets.

## OpenTelemetry Collector Usage

You copy the configuration file to the respective config paths as per your
installation methods. Followed by respective instructions to start, restart,
and view logs of the `otelcol` binary.

### Systemd

To copy the updated `config.yaml` file:

```bash
sudo cp config.yaml /etc/otelcol-contrib/config.yaml
```

To restart `otelcol` with updated config:

```bash
sudo systemctl restart otelcol-contrib.service
```

To check status of `otelcol`:

```bash
sudo systemctl status otelcol-contrib.service
```

To view logs of `otelcol`:

```bash
sudo journalctl -u otelcol-contrib.service
```

To stop of `otelcol`:

```bash
sudo systemctl stop otelcol-contrib.service
```

### Plain Binary

It is recommended to use the `otelcol` binary inside terminal multiplexer
tools like `tmux` or `screen`, since plain binary usage is ephemeral.

To copy the updated `config.yaml` file:

```bash
cp config.yaml ./otelcol-contrib/config.yaml
```

To change directory inside `otelcol-contrib` folder:

```bash
cd otelcol-contrib
```

To start `otelcol` with updated config:

```bash
./otelcol-contrib --config ./config.yaml &> otelcol-output.log & echo "$!" > otel-pid
```

To view last 50 lines of `otelcol` logs:

```bash
tail -f -n 50 otelcol-output.log
```

To stop `otelcol`:

```bash
kill "$(< otel-pid)"
```

## Test Sending Traces

OpenTelemetry collector binary should be able to forward all types of telemetry data recevied:
traces, metrics, and logs, to SigNoz OTLP endpoint via gRPC.

Let's send sample traces to the `otelcol` using `telemetrygen`.

To install telemetrygen binary:

```bash
go install github.com/open-telemetry/opentelemetry-collector-contrib/cmd/telemetrygen@latest
```

To send trace data using `telemetrygen`, execute the command below:

```bash
telemetrygen traces --traces 1 --otlp-endpoint localhost:4317 --otlp-insecure
```

Output should look like this:

```
...
2023-03-15T11:04:38.967+0545    INFO    channelz/funcs.go:340   [core][Channel #1] Channel Connectivity change to READY {"system": "grpc", "grpc_log": true}
2023-03-15T11:04:38.968+0545    INFO    traces/traces.go:124    generation of traces isn't being throttled
2023-03-15T11:04:38.968+0545    INFO    traces/worker.go:90     traces generated        {"worker": 0, "traces": 1}
2023-03-15T11:04:38.969+0545    INFO    traces/traces.go:87     stop the batch span processor
2023-03-15T11:04:38.983+0545    INFO    channelz/funcs.go:340   [core][Channel #1] Channel Connectivity change to SHUTDOWN      {"system": "grpc", "grpc_log": true}
2023-03-15T11:04:38.984+0545    INFO    channelz/funcs.go:340   [core][Channel #1 SubChannel #2] Subchannel Connectivity change to SHUTDOWN     {"system": "grpc", "grpc_log": true}
2023-03-15T11:04:38.984+0545    INFO    channelz/funcs.go:340   [core][Channel #1 SubChannel #2] Subchannel deleted     {"system": "grpc", "grpc_log": true}
2023-03-15T11:04:38.984+0545    INFO    channelz/funcs.go:340   [core][Channel #1] Channel deleted      {"system": "grpc", "grpc_log": true}
2023-03-15T11:04:38.984+0545    INFO    traces/traces.go:79     stopping the exporter
```

If the SigNoz endpoint in the configuration is set correctly and accessible,
you should be able to see the traces sent via OpenTelemetry collector in VM
from `telemetrygen` in the SigNoz UI.

![traces generated by telemetrygen][2]

</TabItem>
</Tabs>

## HostMetrics Dashboard

In this section, we will generate and import dashboard with VM HostMetrics.

:::info
Optionally, we can use generic dashboard with hostname variable. To do that,
import the `hostmetrics-with-variable.json` file in SigNoz UI from [here][4].
:::

It involves two steps: generting dashboard JSON using bash script and
importing dashboard JSON in SigNoz UI.

To generate HostMetrics dashboards for the VM:

```bash
curl -sL https://github.com/SigNoz/benchmark/raw/main/dashboards/hostmetrics/hostmetrics-import.sh | bash
```

Output should look similar to the following:

```
✅ Succesfully generated Host Metrics dashboard: signoz-hostmetrics-one-piece.json
```

After importing the dashboard JSON, we should see the following dashboard in SigNoz UI:

![hostmetrics dashboard][3]

---

### List of metrics

<HostMetrics name="Virtual Machine Metrics"/>

---

[1]: https://github.com/open-telemetry/opentelemetry-collector-releases/releases
[2]: /img/docs/telemetrygen-output.png
[3]: /img/docs/hostmetrics-dashboard.png
[4]: https://github.com/SigNoz/dashboards/raw/main/hostmetrics/hostmetrics-with-variable.json
