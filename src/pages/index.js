import React, { Fragment, useEffect, useState } from "react";
import ReactModal from "react-modal";

import { Header } from "../modules/index-header";
import { TrustedByTeams } from "../modules/trusted-by";
import { WhyOpenTelemetry } from "../modules/why-opentelemetry";
import { SigNozFeatures } from "../modules/index-features";
import { Testimonials } from "../modules/testimonials";

import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ReactGA from "react-ga";
import styles from "./styles.module.css";
import { LiteYoutubeEmbed } from "react-lite-yt-embed";

import FAQBody from "@site/src/components/FAQ";
import Heading from "../components/ui/Heading";
import Hero from "../components/ui/Hero";
import SubHeading from "../components/ui/SubHeading";
import Button from "../components/ui/Button";

ReactGA.initialize("UA-152867655-1");

const getStartedClicked = () => {
  ReactGA.event({
    category: "User",
    action: "Clicked get started button",
  });
};

const requestDemoClicked = () => {
  ReactGA.event({
    category: "User",
    action: "Request Demo Clicked",
  });
};

const WhySigNoz = () => {
  const [feature, setFeature] = useState("pricing");

  const handlePricing = () => {
    setFeature("pricing");
  };

  const handlePrivacy = () => {
    setFeature("olap");
  };

  const handleExtendibility = () => {
    setFeature("tag-filtering");
  };

  return (
    <div className="container">
      <div className="container">
        <div className="row">
          <div className={`col col--3 ${styles.menu__list}`}>
            <button
              onClick={handlePricing}
              className={`button button--lg ${
                feature === "pricing"
                  ? "feature-tab-css__selected"
                  : "feature-tab-css"
              }`}
              style={{ marginBottom: 20, marginTop: 0, whiteSpace: "normal" }}
            >
              Integrated UI for metrics, traces and logs
            </button>
            <button
              onClick={handlePrivacy}
              className={`button button--lg ${
                feature === "olap"
                  ? "feature-tab-css__selected"
                  : "feature-tab-css"
              }`}
              style={{ marginBottom: 20, marginTop: 20, whiteSpace: "normal" }}
            >
              Advanced traces filtering{" "}
            </button>
            <button
              onClick={handleExtendibility}
              className={`button button--lg ${
                feature === "tag-filtering"
                  ? "feature-tab-css__selected"
                  : "feature-tab-css"
              }`}
              style={{ marginBottom: 20, marginTop: 20, whiteSpace: "normal" }}
            >
              Drill down into interesting traces
            </button>
          </div>
          <div className="col col--9">
            <div
              className="hero__screenshot"
              style={{ display: feature === "pricing" ? "block" : "none" }}
            >
              <img
                src={useBaseUrl("img/metrics-tooltip-light-v2.webp")}
                alt="SigNoz screenshot"
              />
            </div>
            <div
              className="hero__screenshot"
              style={{ display: feature === "olap" ? "block" : "none" }}
            >
              <img
                src={useBaseUrl("img/advanced-trace-filtering.webp")}
                alt="SigNoz screenshot"
              />
            </div>
            <div
              className="hero__screenshot"
              style={{
                display: feature === "tag-filtering" ? "block" : "none",
              }}
            >
              <img
                src={useBaseUrl("img/trace-detail.webp")}
                alt="SigNoz screenshot"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    title: "Your data in your boundary",
    imageUrl: "svgs/icons/your-data-in-your-boundary-dark.svg",
    description: (
      <>
        No need to worry about GDPR and other data protection laws. All your
        tracing and monitoring data is now in YOUR infra.
      </>
    ),
  },
  {
    title: "Metrics, Traces and Logs in one app",
    imageUrl: "svgs/icons/metrics-traces-and-logs-dark.svg",
    description: (
      <>
        Easily correlate from metrics, traces and logs with seamless click
        through from one to other
      </>
    ),
  },
  {
    title: "OpenTelemetry Native",
    imageUrl: "svgs/icons/open-telemetry-native-dark.svg",
    description: (
      <>Take advantage of rich OpenTelemetry ecosystem for instrumentation.</>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={`col col--4 ${styles.feature}`}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3 className="text--center">{title}</h3>
      <p className="text--center">{description}</p>
    </div>
  );
}

function ModalCard(props) {
  const { title, desc, info, link, button } = props;

  return (
    <div
      className="card-demo"
      style={{ width: "100%", marginTop: "1.5rem", maxWidth: "14rem" }}
    >
      <div className="card" style={{ color: "#000", height: "15rem" }}>
        <div className="card__header">
          <h3 style={{ color: "#333333" }}>{title}</h3>
        </div>
        <div className="card__body">
          <p>{desc}</p>
        </div>
        <div className="card__footer" style={{ color: "#2F80ED" }}>
          {info}
        </div>
        {button}
      </div>
    </div>
  );
}

function TrySignozModal(props) {
  const { isOpen, onClose } = props;

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="onRequestClose Example"
      onRequestClose={onClose}
      className="Modal try-signoz-modal"
      overlayClassName="Overlay"
    >
      <h1 style={{ marginTop: "2rem", textAlign: "center", color: "#333333" }}>
        Try SigNoz for free
      </h1>
      <div className={"container"}>
        <div className={"row"}>
          <div
            className={"col col--6"}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Link
              style={{ textDecoration: "none" }}
              href={"/docs/install/docker"}
            >
              <ModalCard
                title={"Open source"}
                desc={"Want to use our free open-source product?"}
                info={
                  <div>
                    Deploy SigNoz to your infrastructure. Free{" "}
                    <div>forever</div>
                  </div>
                }
              />
            </Link>
          </div>

          <div
            className={"col col--6"}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Link style={{ textDecoration: "none" }} href={"/pricing"}>
              <ModalCard
                title={"Cloud"}
                desc={"Small business or low volume & don’t want hassle?"}
                info={
                  "This is the simplest way to get started. Create an account"
                }
              />
            </Link>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}

const Statistics = () => {
  const STATS_LIST = [
    { id: 1, name: "Downloads", value: "3.2M" },
    { id: 2, name: "GitHub Stars", value: "13.8k+" },
    { id: 3, name: "Contributors", value: "100+" },
    { id: 4, name: "Community Members", value: "2.8k+" },
  ];
  return (
    <section>
      <div className="py-16 bg-[#252529]">
        <div className="container">
          <div className="flex flex-col justify-center items-center mb-10 text-center">
            <Heading>
              Developers <span className="heart-emoji">❤️</span> Open Source
              SigNoz
            </Heading>
            <SubHeading>
              Join our huge open source community and nerd about observability
            </SubHeading>
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-16">
            <div className="grid grid-cols-2 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
              {STATS_LIST.map((stat) => (
                <div
                  key={stat.id}
                  className="mx-auto flex max-w-xs flex-col gap-y-4 justify-center"
                >
                  <div className="text-2xl leading-7 text-white">
                    {stat.name}
                  </div>
                  <div className="order-first text-2xl font-semibold tracking-tight sm:text-5xl text-white">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <Button isButton href={"https://signoz.io/slack"}>
              Join our slack community
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const LatestInOpenTelementry = () => {
  const TUTORIALS_LIST = [
    {
      youtubeId: "Wzut0kjVeYI",
      desc: "Getting started with OpenTelemetry.",
    },
    {
      youtubeId: "sL6XvOOAEP0",
      desc: "Gathering data with the OpenTelemetry Collector.",
    },
    {
      youtubeId: "CgByZJeuRZY",
      desc: "Implementing Distributed Tracing in a NodeJS Application using OpenTelemetry",
    },
  ];

  return (
    <section>
      <div className="container my-16">
        <div className="flex flex-col items-center mb-5 text-center">
          <Heading type={4}>Read ABOUT</Heading>
          <Heading type={1}>Latest in OpenTelemetry</Heading>
        </div>
        <div className="row">
          {TUTORIALS_LIST.map((tutorial) => (
            <div key={tutorial.youtubeId} className="col col--4">
              <div className="card-demo margin--sm">
                <div className="card rounded-lg bluish-gradient">
                  <div className="card__body p-0">
                    <div className="flex flex-col gap-5">
                      <LiteYoutubeEmbed id={tutorial.youtubeId} mute={false} />
                      <p className="px-5 text-ellipsis line-clamp-2">
                        {tutorial.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Tutorials = () => {
  const TUTORIALS_LIST = [
    {
      youtubeId: "oQFMfEc9JNI",
      desc: "Using an open source standard frees you from vendor lock-in.",
    },
    {
      youtubeId: "u2PiWKEdjCw",
      desc: "Using an open source standard frees you from vendor lock-in.Using an open source standard frees you from vendor lock-in.Using an open source standard frees you from vendor lock-in.Using an open source standard frees you from vendor lock-in.",
    },
    {
      youtubeId: "CgByZJeuRZY",
      desc: "Using an open source standard frees you from vendor lock-in.",
    },
  ];

  return (
    <section>
      <div className="container my-16">
        <div className="flex flex-col items-center mb-5">
          <Heading type={4}>LEARN</Heading>
          <Heading type={1}>Tutorials</Heading>
        </div>
        <div className="row">
          {TUTORIALS_LIST.map((tutorial) => (
            <div key={tutorial.youtubeId} className="col col--4">
              <div className="card-demo margin--sm">
                <div className="card rounded-lg bluish-gradient">
                  <div className="card__body p-0">
                    <div className="flex flex-col gap-5">
                      <LiteYoutubeEmbed id={tutorial.youtubeId} mute={false} />
                      <p className="px-5 text-ellipsis line-clamp-2">
                        {tutorial.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BuildForDevelopers = () => {
  const REASONS = [
    {
      title: "Query Builder",
      desc: "Write queries on all telemetry signals. Run aggregates, and apply filters and formulas to get deeper insights from your data.",
      figure: "/img/landing/property-query-buider.png",
    },
    {
      title: "Columnar Database",
      desc: "SigNoz uses ClickHouse - a fast open source distributed columnar database. Ingestion and aggregations are lightening fast.",
      figure: "/img/landing/property-columnar-database.png",
    },
    {
      title: "Telemetry Pipelines",
      desc: "Build telemetry pipelines easily with SigNoz OTel Collector. Integrate any existing pipeline with OTel Collector to send data to SigNoz.",
      figure: "/img/landing/property-telemetry-pipeline.png",
    },
    {
      title: "Source Code",
      desc: "Check out the entire source code of SigNoz on GitHub. Create issues, build features & integrations, get started without contacting any sales rep.",
      figure: "/img/landing/property-source-code.png",
    },
  ];
  return (
    <section>
      <div className="overflow-hidden">
        <div
          className={`relative
          after:-z-[2] after:absolute after:content-[''] after:w-[180px] md:after:w-[350px] after:h-[800px] lg:after:w-[500px] lg:after:h-[600px] xl:after:w-[750px] xl:after:h-[600px] after:top-[10%] after:-left-[50%] after:bg-primary-500 after:rounded-full after:opacity-50 after:blur-3xl 
          before:-z-[2] before:absolute before:content-[''] before:w-[180px] md:before:w-[350px] before:h-[800px] lg:before:w-[500px] lg:before:h-[600px] xl:before:w-[750px] xl:before:h-[600px] before:top-[10%] before:-right-[50%] before:bg-primary-500 before:rounded-full before:opacity-50 before:blur-3xl 
      `}
        >
          <div className={`container px-5 py-12 mx-auto mb-0`}>
            <div className="flex flex-col items-center mb-10 text-center">
              <Heading type={4}>
                Get granular control over your observability data.
              </Heading>
              <Heading type={1}>Built for developers like you.</Heading>
            </div>

            <div className="divide-y-2 divide-gray-100 max-w-xl lg:max-w-3xl mx-auto">
              {REASONS.map((reason) => (
                <div
                  className="flex flex-row-reverse gap-5 lg:gap-0 lg:grid lg:grid-cols-2 for-devs-container py-5"
                  key={reason.title}
                >
                  <div className="flex gap-10 justify-center lg:justify-start items-center w-1/5 lg:w-auto">
                    <img
                      src={reason.figure}
                      alt="figure for devs"
                      className="w-14 h-14 block"
                    />
                    <h2 className="hidden lg:block text-2xl font-medium mb-2">
                      {reason.title}
                    </h2>
                  </div>
                  <div className="flex-shrink w-4/5 lg:w-auto">
                    <h2 className="block lg:hidden text-2xl font-medium mb-2">
                      {reason.title}
                    </h2>
                    <p className="leading-relaxed">{reason.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  return (
    <section className="">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col justify-center items-center mb-10 text-center">
          <Heading>Pricing you can trust.</Heading>
          <SubHeading>
            Tired of Datadog’s unpredictable bills or New Relic’s user-based
            pricing? <br className="hidden lg:inline" />
            We’re here for you.
          </SubHeading>
        </div>
        <div className="flex flex-wrap md:max-w-md lg:max-w-5xl mx-auto gap-y-5 justify-center">
          <div className="md:w-full lg:w-1/3 xl:w-1/3 px-8 py-1 pricing-card">
            <Heading type={3}>No user-based pricing</Heading>
            <p className="leading-relaxed text-base mb-4 text-gray-400">
              Add as many team members as you want.
            </p>
          </div>
          <div className="md:w-full lg:w-1/3 xl:w-1/3 px-8 py-1 pricing-card">
            <Heading type={3}>Simple usage-based pricing</Heading>
            <p className="leading-relaxed text-base mb-4 text-gray-400">
              Only pay for the data you send.
            </p>
          </div>
          <div className="md:w-full lg:w-1/3 xl:w-1/3 px-8 py-1 pricing-card">
            <Heading type={3}>No special pricing for custom metrics</Heading>
            <p className="leading-relaxed text-base mb-4 text-gray-400">
              All metrics charged simply at $0.1 per million samples.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="bluish-gradient py-16">
      <div className="container">
        <div className="mx-auto max-w-xl">
          <div className="">
            <Heading type={2}>
              OpenTelemetry-Native Metrics, Logs,
              <br className="hidden lg:inline" />
              and Traces in a single pane of glass
            </Heading>
            <SubHeading>
              Check out our hosted and enterprise solutions.
            </SubHeading>
          </div>
          <div className="flex gap-5 flex-col sm:flex-row">
            <Button
              isButton
              className=""
              to={"/teams/"}
              id="btn-get-started-homepage-bottom"
            >
              Try SigNoz Cloud
            </Button>
            <Button
              isButton
              outlined
              className=""
              to={"/docs/install/"}
              onClick={requestDemoClicked}
              id="btn-self-hosted-homepage-bottom"
            >
              Self-Host
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Observability = () => {
  return (
    <section>
      <div className="container mt-16">
        <div className="flex flex-col items-center mb-5 text-center">
          <Heading type={4}>Enterprise Grade Observability</Heading>
          <Heading type={1}>
            Get access to observability at any scale
            <br className="hidden lg:inline" />
            with advanced security and compliance.
          </Heading>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#252529] grid grid-cols-1 md:grid-cols-2 md:gap-10 mx-auto rounded-lg plans-container px-10 py-8">
            <div>
              <ul className="plans-features m-0">
                <li className="py-3 text-lg">SSO and SAML support</li>
                <li className="py-3 text-lg">Query API Keys</li>
                <li className="py-3 text-lg">Advanced Security</li>
                <li className="py-3 text-lg">AWS Private Link</li>
              </ul>
            </div>
            <div>
              <div className="flex flex-col justify-between h-full">
                <ul className="plans-features m-0">
                  <li className="py-3 text-lg">VPC Peering</li>
                  <li className="py-3 text-lg">Custom Integrations</li>
                </ul>
                <Button isButton to={"pricing"} className="hidden md:block">
                  Check plans
                </Button>
              </div>
            </div>
          </div>
          <div>
            <Button
              isButton
              to={"pricing"}
              className="block md:hidden w-full mx-auto my-5"
            >
              Check plans
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const DataProtection = () => {
  return (
    <section>
      <div className="container mt-5 mb-24">
        <div className="flex flex-col items-center mb-1 text-center">
          <Heading type={1}>
            Worried about data protection laws?
            <br className="hidden lg:inline" />
            We can help.
          </Heading>
        </div>
        <div className="md:grid grid-cols-2 max-w-4xl mx-auto gap-10 my-16 self-hosted-data-protection">
          <div className="mb-10 text-center md:text-left md:pl-5 flex flex-col justify-between gap-5">
            <div>
              <Heading type={4}>For SigNoz Cloud</Heading>
              <Heading type={3}>
                Send data to your preferred hosting location
              </Heading>
              <SubHeading>
                Store your data in the US, EU or India region depending on your
                needs.
              </SubHeading>
            </div>
            <div className="flex flex-wrap gap-5 justify-center md:justify-start">
              <div className="flex gap-1 flex-col justify-center items-center md:items-start">
                <img
                  src="/img/landing/us.png"
                  alt="flag of hosting available"
                />
                <span>US Cloud</span>
              </div>
              <div className="flex gap-1 flex-col justify-center items-center md:items-start">
                <img
                  src="/img/landing/eu.png"
                  alt="flag of hosting available"
                />
                <span>EU Cloud</span>
              </div>
              <div className="flex gap-1 flex-col justify-center items-center md:items-start">
                <img
                  src="/img/landing/india.png"
                  alt="flag of hosting available"
                />
                <span>India Cloud</span>
              </div>
            </div>
            <Button to="/teams">Try SigNoz Cloud</Button>
          </div>
          <div className="mb-10 text-center md:text-left md:pl-5 flex flex-col justify-between gap-5">
            <div>
              <Heading type={4}>For Self-Hosted</Heading>
              <Heading type={3}>Have your customer data in your infra</Heading>
              <SubHeading>
                You can self-host SigNoz or opt for our managed self-hosted
                offerings to have complete adherence to data privacy and
                regulation laws.
              </SubHeading>
            </div>
            <div className="flex flex-wrap gap-5 justify-center md:justify-start">
              <div className="flex gap-1 flex-col justify-center items-center md:items-start">
                <img
                  src="/img/landing/data-privacy.png"
                  alt="data privacy available"
                />
                <span>Data Privacy</span>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center md:items-start gap-5 md:gap-0 lg:justify-between">
              <Button to="/docs/install/">Self Host</Button>
              <Button to="/enterprise/">Managed by SigNoz in your cloud</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function Home() {
  const [showTrySignozModal, setShowTrySignozModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  useEffect(() => {
    ReactModal.setAppElement("#modal-root");
  }, []);

  const closeTrySignozModal = () => {
    setShowTrySignozModal(false);
  };

  return (
    <Fragment>
      <Layout
        title={`Open source APM`}
        description="SigNoz is an open-source APM to help you find issues in your deployed applications & solve them quickly.
      It provides an integrated UI for metrics and traces with deep filtering and aggregation to pin down specific issues very quickly.
      Built with ClickHouse as datastore, it is designed to handle enterprise scale."
      >
        <TrySignozModal
          isOpen={showTrySignozModal}
          onClose={closeTrySignozModal}
        />

        <main className="landing-section">
          <Header />
          <TrustedByTeams />
          <SigNozFeatures />
          <WhyOpenTelemetry />
          <LatestInOpenTelementry />
          <BuildForDevelopers />
          <DataProtection />
          <Observability />
          <Pricing />
          <Statistics />
          <Testimonials />
          {/* <Tutorials /> */}
          <CTA />
        </main>
      </Layout>
      <div id={"modal-root"}></div>
    </Fragment>
  );
}

export default Home;
