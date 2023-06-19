import React, { useState } from "react"
import styles from "./styles.module.css"
import Link from "@docusaurus/Link";
import { PlaySVG } from "../../svgs/common";





export const Header = () => {

    const [showVideo, setShowVideo] = useState(false);

    return(


<header className="hero">
    <div className="container" style={{textAlign:'center'}}>

        
        <p className="" style={{ fontWeight: "bold", fontSize: "42px" }}>
            Open Source Observability with 
            <span className={styles.highlight}> Traces</span>, <br></br> <span className={styles.highlight}>Logs </span>and<span className={styles.highlight}> Metrics </span>in a single pane            {/* Open-source application monitoring platform */}
        </p>

        <p className="hero__subtitle">
        With our open source platform, customer data never has to leave your infrastructure
        </p>

        <div style={{ margin: "1rem 0" }}>
            <Link
              style={{
                  margin: "6px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
              }}
              className="button button--primary "
              // onClick={setShowTrySignozModal.bind(this,true)}
              href={"/teams/"}
              //   onClick={getStartedClicked}
              id="btn-get-started-homepage-hero"
            >
              Try SigNoz Cloud
            </Link>
            <Link
              style={{
                  margin: "6px",
                  paddingLeft: "30px",
                  paddingRight: "30px",
              }}
              className="button button--outline button--secondary "
              href={"/docs/install/"}
              id="btn-self-host-homepage-hero"
              // href={"https://forms.gle/YDJ3wBFx7nhDnUbr5"}
              //   onClick={requestDemoClicked}
            >
              Self Host
            </Link>


        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "16px", justifyContent:'center'}}>
            <img src={"/img/yc-logo-white.svg"} height={24}
            alt={"YCombinator"} style={{ marginRight: 16 }}/>{" "}
            Backed by Y Combinator
        </div>

        <div style={{display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'}} >
{showVideo === false ? (
  <div
    id={"demo-video-cover"}
    onClick={setShowVideo.bind(this, true)}
    style={{
      background: "url('/videos/demo-mar10-cover.webp')",
      // height: 426,
      width: "80%",
      textAlign:'center'
    }}
  >
    <div id={"demo-overlay"}></div>
    <div id={"demo-content"}>
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        SigNoz - Quick Intro
      </div>
      <PlaySVG />
    </div>
  </div>
) : (
  <div>
    <video
      width="100%"
      height="480"
      autoPlay
      controls
      id={"demo-video-player"}
    >
      <source
        src="https://demo-video-1.s3.us-east-2.amazonaws.com/SigNoz-Demo-Sept2-2022.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
  </div>
)}
        </div>

    </div>

</header>




    )
}