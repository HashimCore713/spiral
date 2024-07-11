import React, { Fragment} from 'react'

import { Page } from '../../../payload/payload-types'
import { Gutter } from '../../_components/Gutter'
import { CMSLink } from '../../_components/Link'
import { Media } from '../../_components/Media'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

interface CustomHeroProps {
  richText: string;
  media?: { image: { filename: string } }[];
  links?: { link: any }[];
}

const CustomHero: React.FC<CustomHeroProps> = ({ richText, media, links }) => {
  let currentIndex = 0;

  // Function to advance to the next slide
  const nextSlide = () => {
    if (media && media.length > 1) {
      currentIndex = (currentIndex + 1) % media.length;
      const slides = document.querySelectorAll(`.${classes.heroSlide}`);
      slides.forEach((slide, index) => {
        (slide as HTMLElement).style.transform = `translateX(-${currentIndex * 100}%)`;
      });
    }
  };

  // Automatically advance to the next slide every 3 seconds
  setInterval(nextSlide, 3000);

  return (
    <section className={classes.hero}>
      <div className={classes.heroWrapper}>
        <div className={classes.heroSlides}>
          {media?.map((item, index) => (
            <div key={index} className={classes.heroSlide} style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_SERVER_URL}/media/${item.image.filename})` }}>
              <div className={classes.heroTextBox}>
                <RichText content={richText} />
                {Array.isArray(links) && links.length > 0 && (
                  <ul className={classes.links}>
                    {links.map(({ link }, i) => (
                      <li key={i}>
                        <CMSLink {...link} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomHero;