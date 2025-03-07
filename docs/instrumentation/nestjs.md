---
id: nestjs
title: Nestjs OpenTelemetry Instrumentation
description: Send events from your Nestjs application to SigNoz

---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import InstrumentationFAQ from '../shared/instrumentation-faq.md'


This document contains instructions on how to set up OpenTelemetry instrumentation in your Nestjs applications. OpenTelemetry, also known as OTel for short, is an open source observability framework that can help you generate and collect telemetry data - traces, metrics, and logs from your Nestjs application.


Once the telemetry data is collected, you can configure an exporter to send the data to SigNoz.

There are three major steps to using OpenTelemetry:

- Instrumenting your Nestjs application with OpenTelemetry
- Configuring exporter to send data to SigNoz
- Validating that configuration to ensure that data is being sent as expected.

<figure data-zoomable align='center'>
    <img src="/img/docs/nestjs_instrumentation.webp" alt="All in one auto instrumentation library - identifies and instruments packages used by your NestJS application"/>
    <figcaption><i>All in one auto instrumentation library - identifies and instruments packages used by your NestJS application</i></figcaption></figure>
<br></br>

You have two choices for instrumenting your NestJS application with OpenTelemetry.

- **[Use the all-in-one auto-instrumentation library(Recommended)](#using-the-all-in-one-auto-instrumentation-library)**<br></br>
The auto-instrumentation library of OpenTelemetry is a meta package that provides a simple way to initialize multiple Nodejs instrumnetations.

:::info

  If you are on K8s, you should checkout [opentelemetry operators](/docs/tutorial/opentelemetry-operator-usage/#opentelemetry-auto-instrumentation-injection) which enable auto instrumenting Javascript applications very easily.

:::

- **[Use a specific auto-instrumentation library](#using-a-specific-auto-instrumentation-library)**<br></br>
You can use individual auto-instrumentation libraries too for a specific component of your application. For example, you can use `@opentelemetry/instrumentation-nestjs-core` for instrumenting the Nestjs web framework.

Let's see how to instrument your Nestjs application with OpenTelemetry.

## Requirements

**Supported Versions**

- `>=4.0.0`

## Send Traces Directly to SigNoz

### Using the all-in-one auto-instrumentation library

The recommended way to instrument your Nestjs application is to use the all-in-one auto-instrumentation library -  `@opentelemetry/auto-instrumentations-node`. It provides a simple way to initialize multiple Nodejs instrumentations.

Internally, it calls the specific auto-instrumentation library for components used in the application. You can see the complete list [here](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/metapackages/auto-instrumentations-node#supported-instrumentations).

#### Steps to auto-instrument Nestjs application

1. Install the dependencies<br></br>
   We start by installing the relevant dependencies.
    
    ```bash
    npm install --save @opentelemetry/sdk-node
    npm install --save @opentelemetry/auto-instrumentations-node
    npm install --save @opentelemetry/exporter-trace-otlp-http
    ```

2. Create a `tracer.ts` file
    
    ```jsx
    'use strict'
    const process = require('process');
    //OpenTelemetry
    const opentelemetry = require('@opentelemetry/sdk-node');
    const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
    const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
    const {Resource} = require('@opentelemetry/resources');
    const {SemanticResourceAttributes} = require('@opentelemetry/semantic-conventions');
    
    const exporterOptions = {
        url: 'http://localhost:4318/v1/traces'
      }
    
    const traceExporter = new OTLPTraceExporter(exporterOptions);
    const sdk = new opentelemetry.NodeSDK({
      traceExporter,
      instrumentations: [getNodeAutoInstrumentations()],
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'sampleNestjsApplication'
      })
      });
      
      // initialize the SDK and register with the OpenTelemetry API
      // this enables the API to record telemetry
      sdk.start()
      .then(() => console.log('Tracing initialized'))
      .catch((error) => console.log('Error initializing tracing', error));
      
      // gracefully shut down the SDK on process exit
      process.on('SIGTERM', () => {
        sdk.shutdown()
        .then(() => console.log('Tracing terminated'))
        .catch((error) => console.log('Error terminating tracing', error))
        .finally(() => process.exit(0));
        });
        
      module.exports = sdk
    ```
    

3. Import the tracer module where your app starts
    
    ```jsx
    const tracer = require('./tracer')
    ```
    

4. Start the tracer<br></br>
   In the `async function boostrap` section of the application code, initialize the tracer as follows: 
    
    ```jsx
    const tracer = require('./tracer')
    
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';
      // All of your application code and any imports that should leverage
      // OpenTelemetry automatic instrumentation must go here.
    
    async function bootstrap() {
        // highlight-start
        await tracer.start();
        //highlight-end
        const app = await NestFactory.create(AppModule);
        await app.listen(3001);
      }
      bootstrap();
    ```

    You can now run your Nestjs application. The data captured with OpenTelemetry from your application should start showing on the SigNoz dashboard.
    

### Validating instrumentation by checking for traces

With your application running, you can verify that you’ve instrumented your application with OpenTelemetry correctly by confirming that tracing data is being reported to SigNoz.

To do this, you need to ensure that your application generates some data. Applications will not produce traces unless they are being interacted with, and OpenTelemetry will often buffer data before sending. So you need to interact with your application and wait for some time to see your tracing data in SigNoz.

Validate your traces in SigNoz:

1. Trigger an action in your app that generates a web request. Hit the endpoint a number of times to generate some data. Then, wait for some time.
2. In SigNoz, open the `Services` tab. Hit the `Refresh` button on the top right corner, and your application should appear in the list of `Applications`.
3. Go to the `Traces` tab, and apply relevant filters to see your application’s traces.

You might see other dummy applications if you’re using SigNoz for the first time. You can remove it by following the docs [here](https://signoz.io/docs/operate/docker-standalone/#remove-the-sample-application).

<figure data-zoomable align='center'>
    <img src="/img/docs/nestjs_application_instrumented.webp" alt="Nestjs Application in the list of services being monitored in SigNoz"/>
    <figcaption><i>Nestjs Application in the list of services being monitored in SigNoz</i></figcaption>
</figure>

<br></br>

If you don't see your application reported in the list of services, try our [troubleshooting](https://signoz.io/docs/install/troubleshooting/) guide.


### Using a specific auto-instrumentation library

If you want to instrument only your Nestjs framework, then you need to use the following package:

```jsx
npm install --save @opentelemetry/instrumentation-nestjs-core
```

Note that in the above case, you will have to install packages for all the components that you want to instrument with OpenTelemetry individually. You can find detailed instructions [here](https://signoz.io/docs/instrumentation/javascript/#using-a-specific-auto-instrumentation-library).

## Instrumentation Modules for Databases

The `@opentelemetry/auto-instrumentations-node` can inititialize instrumentation for popular databases. Hence it’s recommended to [get started](#using-the-all-in-one-auto-instrumentation-library) with it.

But if you are using [specific auto-instrumentation packages](#using-a-specific-auto-instrumentation-library), here’s a list of packages for popular databases.

### MongoDB instrumentation

Note if you’re using `@opentelemetry/auto-instrumentations-node`, you don’t need to install specific modules for your database.

**Supported Versions**

• `>=3.3 <5`

Module that provides automatic instrumentation for MongoDB:

```jsx
npm install --save @opentelemetry/instrumentation-mongodb
```

### Redis Instrumentation

Note if you’re using `@opentelemetry/auto-instrumentations-node`, you don’t need to install specific modules for your database.

**Supported Versions**

This package supports `redis@^2.6.0` and `redis@^3.0.0`
For version `redis@^4.0.0`, please use `@opentelemetry/instrumentation-redis-4`

```jsx
npm install --save @opentelemetry/instrumentation-redis
```

### MySQL Instrumentation

Note if you’re using `@opentelemetry/auto-instrumentations-node`, you don’t need to install specific modules for your database.

**Supported Versions**

• `2.x`

Module that provides automatic instrumentation for MySQL:

```jsx
npm install --save @opentelemetry/instrumentation-mysql
```

### Memcached Instrumentation

Note if you’re using `@opentelemetry/auto-instrumentations-node`, you don’t need to install specific modules for your database.

**Supported Versions**

- `>=2.2`

Module that provides automatic instrumentation for Memcached:

```jsx
npm install --save @opentelemetry/instrumentation-memcached
```

## Troubleshooting your installation

Set an environment variable to run the OpenTelemetry launcher in debug mode, where it logs details about the configuration and emitted spans:

```bash
export OTEL_LOG_LEVEL=debug
```

<br></br>

The output may be very verbose with some benign errors. Early in the console output, look for logs about the configuration. Next, look for lines like the ones below, which are emitted when spans are emitted to SigNoz.

```bash
{
  "traceId": "985b66d592a1299f7d12ebca56ca1fe3",
  "parentId": "8d62a70aa335a227",
  "name": "bar",
  "id": "17ada85c3d55376a",
  "kind": 0,
  "timestamp": 1685674607399000,
  "duration": 299,
  "attributes": {},
  "status": { "code": 0 },
  "events": []
}
{
  "traceId": "985b66d592a1299f7d12ebca56ca1fe3",
  "name": "foo",
  "id": "8d62a70aa335a227",
  "kind": 0,
  "timestamp": 1585130342183948,
  "duration": 315,
  "attributes": {
    "name": "value"
  },
  "status": { "code": 0 },
  "events": [
    {
      "name": "event in foo",
      "time": [1585130342, 184213041]
    }
  ]
}
```

<br></br>

_Running short applications (Lambda/Serverless/etc)_
If your application exits quickly after startup, you may need to explicitly shutdown the tracer to ensure that all spans are flushed:

```bash
opentelemetry.trace.getTracer('your_tracer_name').getActiveSpanProcessor().shutdown()
```

<p>&nbsp;</p>

## Further Reading

- [Nodejs Performance Monitoring](https://signoz.io/blog/nodejs-performance-monitoring/)
- [Implementing Distributed Tracing in a Nodejs application](https://signoz.io/blog/distributed-tracing-nodejs/)



<InstrumentationFAQ />




