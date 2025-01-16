import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

import Logo from '@site/static/img/logo.svg'

import s from './index.module.css'


const Home = () => {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout>
      <main className={s.wrapper}>
        <div>
          <div className={s.container}>
            <Logo className={s.logo} width="80" height="96"/>
            <h1>{siteConfig.title}</h1>
            <p dangerouslySetInnerHTML={{ __html: siteConfig.tagline }} />
            <Link
              className="button button--primary button--lg"
              to="/setup/prerequisites">
              Get Started
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  )
}


export default Home
