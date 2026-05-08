import React from 'react'
import HeroSection from '../sections/HeroSection'
import CategorySection from '../sections/CategorySection'
import BestSellers from '../sections/BestSellingSection'
import NewsLetter from '../sections/NewsLetter'

const Home = () => {
  return (
    <div >
      <HeroSection/>
      <CategorySection/>
      <BestSellers/>
      <NewsLetter/>
    </div>
  )
}

export default Home