// src/app/page.tsx
"use client";

import { NextPage } from 'next';
import Head from 'next/head';
import ArticleAnalyzer from '../components/ArticleAnalyzer';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Article Analyzer</title>
      </Head>
      <main>
        <ArticleAnalyzer />
      </main>
    </div>
  );
};

export default Home;
