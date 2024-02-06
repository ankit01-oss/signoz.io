import React, { useEffect, useState } from "react";
import { useBlogPost } from "@docusaurus/theme-common/internal";
import BlogPostItemContainer from "@theme/BlogPostItem/Container";
import BlogPostItemHeader from "@theme/BlogPostItem/Header";
import BlogPostItemContent from "@theme/BlogPostItem/Content";
import BlogPostItemFooter from "@theme/BlogPostItem/Footer";
import Link from "@docusaurus/Link";

import trySignozImg from "../../../static/img/try-signoz-cloud-blog-cta.webp";

// apply a bottom margin in list view
function useContainerClassName(isBlogPostPage) {
  return !isBlogPostPage ? "margin-bottom--xl" : "isBlogPostPage";
}

const TEAMS_PAGE_URL = "https://signoz.io/teams/";

export default function BlogPostItem({ children, className }) {
  const { isBlogPostPage } = useBlogPost();
  const containerClassName = useContainerClassName(isBlogPostPage);

  return (
    <BlogPostItemContainer
      className={`${containerClassName} ${className} signoz-blog-post`}
    >
      <div className="blog-cta-container">
        <div className="blog-post-content">
          <BlogPostItemHeader />
          <BlogPostItemContent>{children}</BlogPostItemContent>
          <BlogPostItemFooter />
        </div>

        {isBlogPostPage && (
          <div className="blog-post-cta">
            <Link
              href={TEAMS_PAGE_URL}
              className="cta-image-container"
              id="try-signoz-cloud-blogpage-cta"
            >
              <img id="cta-image" className="cta-image" src={trySignozImg} />
            </Link>
          </div>
        )}
      </div>
    </BlogPostItemContainer>
  );
}
