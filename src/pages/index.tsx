import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect } from 'react'
import styles from '../../styles/Home.module.css'
import QCMark from '../editor'

const Home: NextPage = () => {
  useEffect(() => {
    const md = new QCMark('#app')
  }, [])
  
  return (
    <div className={styles.container}>
      <main id='app'></main>
    </div>
  )
}

export default Home
