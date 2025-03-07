---
id: roadmap
title: Product Roadmap
---

We are focused on building an integrated observability tool which can be a superior alternative to current SaaS products like DataDog

You can find items on our immediate roadmap in this Github Board - [SigNoz Roadmap](https://github.com/SigNoz/signoz/projects/2)

More longer term, we plan to ship the following items:

#### Tail based sampling

The decision of which spans to sample is crucial in distributed tracing. "Tail-based sampling" means that trace-retention decisions are done at the tail end of processing after all the spans in a trace have arrived.

We plan to focus on this to ensure that only 'interesting' traces are ingested. This will ensure that we don't miss any interesting traces, even though the actual number of traces ingested/retained is much lower.


#### Anomaly detection framework

A framework to provide dynamic thresholding capabilities to enable better Signal to Noise in alerts. One of the projects we are closely following in this space is LinkedIn's [Third Eye](https://engineering.linkedin.com/blog/2019/01/introducing-thirdeye--linkedins-business-wide-monitoring-platfor) If you know of any other good frameworks, please share in [Github Discussions](https://github.com/SigNoz/signoz/discussions)

---

We believe in taking feedback from our community. Feel free to jump to our [Github Discussions](https://github.com/SigNoz/signoz/discussions) if you have any idea or feature we should build first. We are all ears 👂👂
