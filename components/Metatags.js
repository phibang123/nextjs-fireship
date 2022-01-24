import Head from "next/head";

export default function Metatags({ title, description, image })
{
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary"></meta>
      <meta name="twitter:site" content="@bonlang_dev"></meta>

      <meta name="twitter:title" content={title}></meta>
      <meta name="twitter:description" content={description}></meta>
      <meta name="twitter:image" content={image}></meta>
     
      <meta name="og:title" content={title}></meta>
      <meta name="og:description" content={description}></meta>
      <meta name="og:image" content={image}></meta>
    </Head>

  )
}