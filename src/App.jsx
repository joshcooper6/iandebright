import { createContext, useContext, useEffect, useState } from 'react'
import './App.css'
import cutout from '../public/images/cutout2.png';
import glasses from '../public/images/glasses.jpg';
import { Link, Route, Routes } from 'react-router-dom';
import axios from "axios";
import { useQuery } from 'react-query';

const StateContext = createContext();
const server = 'https://us-central1-iandebright-bd393.cloudfunctions.net/app';

function Remembering() {
  return (
    <>
      <div className="flex-center min-h-screen min-w-screen">
        <div className='flex-col-reverse lg:flex-row justify-center items-center flex w-screen'>
          <img className='grayscale w-[100%] self-center h-[screen] opacity-0 max-w-[650px] fadein delay object-cover contrast-150' src={cutout} />
          <div className='flex fadein opacity-0 mt-10 lg:ml-6 lg:mt-0 lg:mr-10 self-center flex-col'>
            <h2 className='text-sm md:text-lg tracking-widest w-full lg:text-left text-center font-thin opacity-30'>Remembering</h2>
            <h1 className='font-bold tracking-tight w-max text-4xl text-center lg:text-6xl'>Ian DeBright</h1>
            <h2 className='text-sm md:text-lg tracking-widest text-center lg:text-right font-thin mt-1 lg:mt-2 opacity-40'>1990-2023</h2>
          </div>
        </div>

        <Donate />
      </div>
    </>
  )
}


function Header() {
  const { hfTheme } = useContext(StateContext);
  const [mobileToggle, setMobileToggle] = useState(false);

  const links = [
    { text: 'Home', path: '/' },
    { text: 'Obituary', path: '/obituary'},
    { text: 'Photos', path: '/photos' },
    { text: 'Art', path: '/art'},
    // { text: 'Donate', path: '/donate' }
  ]
  
  function NavLink(props) {
    return <Link onClick={() => {props.setMobileToggle(prev => !prev)}} className={`hover:translate-y-[-5px] transease uppercase tracking-widest font-light opacity-50 hover:opacity-100 p-4`} to={props.path} children={props.text} />
  }

  return <>
    <div className={`w-screen ${hfTheme} md:flex-wrap md:flex-row flex-col border-b-[1px] flex gap-2 justify-center items-center`}>
      
      <div className={`md:flex-wrap p-4 transease md:flex-row flex-col`}>
      { links.map((page, index) => {
        return <NavLink text={page.text} setMobileToggle={setMobileToggle} mobileToggle={mobileToggle} path={page.path} key={index} />
      }) }
      </div>

    </div>
  </>
}

function PhotoColumn(props) {
    const array = props.images;
    const { setActive } = props;

    return <div className='column flex'>
      { array.map((image, index) => {
        return <img onClick={() => setActive(image)} className='grayscale  rounded-xl hover:grayscale-0 cursor-pointer object-cover transease' src={image} key={index} />
      }) }
    </div>
}

function PhotoModal(props) {
  const { active, setActive, images } = props;

  return <div onClick={() => setActive(null)} className='w-screen h-screen flex flex-col justify-center items-center fixed left-0 top-0 bg-opacity-90 bg-black z-50'>
      <button className='right-4 top-0 fixed p-6 text-white text-3xl font-thin' onClick={() => setActive(null)}>X</button>
      <img src={active} className='w-10/12 max-w-[600px]' />
    </div> 
}

function shuffleArray(array) {
  // Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function Photos() {
  const [active, setActive] = useState('');

  const { isLoading, error, data } = useQuery('images', async () => {
    const response = await axios.get(`${server}/images`);
    return shuffleArray(response.data);
  });

  const createColumns = (images) => {
    let columns = [];
    for (let i = 0; i < images.length; i += 5) {
      columns.push(
        <PhotoColumn setActive={setActive} images={images.slice(i, i + 5)} key={i} />
      );
    }
    return columns;
  }

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setActive('') } });

  return <>
    <div className='flex-center mt-2 mb-4'>
      {error && <div>Error: {error.message}</div>}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="row flex max-w-[1500px] self-center flex-wrap px-1">
          { createColumns(data) }
        </div>
      )}
    </div>

    { active && <PhotoModal images={data} active={active} setActive={setActive} /> }
  </>
}

function Donate() {
  const petImg = 'https://iandebucket.s3.us-west-2.amazonaws.com/12208581_10207834787446062_5181322771039970307_n.jpg';

  const faithfulInfo = {
    link: 'https://faithfulfriends.us/donate/donate-in-memory-honor/',
    street: '12 Germay Drive',
    city: 'Wilmington, DE',
    zip: '19804'
  }

  return <>
    <div className='flex bg-gray-100 max-w-[1000px] w-11/12 justify-center rounded-2xl lg:flex-row flex-col gap-6 p-6 m-6 min-h-[400px]'>      
      <div className='flex-center'>
        <img src={petImg} className={`w-[300px] contrast-110 brightness-150 grayscale object-top h-[300px] rounded-full object-cover`} />
      </div>
      <div className='flex-center'>
          <p className='max-w-[500px] w-10/12 text-center text-xl md:text-2xl font-thin'>
            Ian loved animals, especially his dog, Mack so in lieu of flowers, 
            the DeBright family requests memorial contributions be made in 
            Ian’s name to <span className='font-black'>Faithful Friends Animal Society.</span>
          </p>      
          <a href={faithfulInfo.link} target='_blank' className='w-10/12 bg-gray-800 text-white hover:scale-110 transease m-6 text-center rounded-xl tracking-wide text-xl border uppercase p-4 hover:bg-gray-700' children={`Donate`} />
        </div>

    </div>
  </>
}

function ArtDivider() {
  const images = ['https://iandebucket.s3.us-west-2.amazonaws.com/11201017_421123294732541_8915239288823445695_o.jpg',
  'https://iandebucket.s3.us-west-2.amazonaws.com/11232740_421123551399182_8905642964158796714_o.jpg',
  'https://iandebucket.s3.us-west-2.amazonaws.com/11200971_421123458065858_38572093834546609_o.jpg'
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [animRunning, setAnimRunning] = useState(false);

  // function previousIndex(current) {
  //   if (current > 0) {
  //     return (current - 1)
  //   };

  //   return (images.length - 1);
  // };

  // function nextIndex(current) {
  //   if (current < (images.length - 1)) {
  //     return (current + 1)
  //   };

  //   return 0;
  // };

  function findIndex(image) {
    return images.indexOf(image)
  }

  useEffect(() => {
    setAnimRunning(true)
  }, [currentImage])

  return <div className='flex-center w-11/12'>
    <h1 className='text-4xl text-center mt-6 md:text-5xl font-thin '>Ian's Artwork</h1>
    <div className='flex flex-col items-center gap-6 self-center justify-around w-full m-6 max-w-[1000px]'>
        <div className='max-w-[600px] lg:max-w-[800px] h-max'>
        <img border onAnimationEnd={() => {setAnimRunning(false)}} src={images[currentImage]} className={`object-cover self-center ${animRunning ? 'fadeinfast' : ''} w-full contrast-150 lg:h-[500px] h-[400px]`}/>
        </div>
        <div id='scroller' className='flex flex-wrap gap-2 mt-2 justify-center transease self-center'>        
          { images.map((image, index) => {
            return <img onClick={() => {setCurrentImage(findIndex(image))}} src={image} key={index} className={`w-[120px] ${image === images[currentImage] ? 'opacity-100 translate-y-[-5px] drop-shadow-xl' : 'grayscale opacity-50'}  hover:grayscale-0 cursor-pointer transease hover:opacity-100 h-[120px] object-cover`} />
          }) }
        </div>
    </div>
  </div>
}


function Obituary() {
  return <div className='flex mb-6 w-10/12 justify-center flex-col text-black items-center '>
  <h1 className='text-4xl p-6 md:text-5xl font-thin '>Ian's Obituary</h1>
  <div className='flex w-full max-w-[800px] justify-center items-center flex-col'>
    <img src={glasses} className={'w-full grayscale md:h-[500px] self-center rounded-2xl object-left object-cover m-6 mt-0'} />
      <p className='lg:text-2xl p-2 text-xl font-light self-center max-w-[800px] flex-center '>
          Ian H. DeBright, age 32, of Wilmington, DE, passed away on Wednesday, January 18th, 2023.

          One of the four children of Ernest and Candida DeBright, Ian was born in Wilmington, DE on November 1, 1990. He attended St. Catherine of Siena grade school and Thomas McKean High School. 
          <br/><br />
          After completing his education, Ian went on to become an auto mechanic, as well as a roofer.
          In his spare time, Ian enjoyed drawing, creating art with various mediums, playing rugby, and spending time with family and friends.
          <br/><br />
          Ian is survived by his parents, Ernest and Candida DeBright; his brothers, Emilio DeBright (Jennifer) and Andrew DeBright (Shanell); his sister, Jennifer Gallagher (Patrick); his nieces and nephews, Dameon, Savanah, Liam and Ava; and many beloved aunts, uncles, and cousins.
      </p>
  </div>
</div>
}

function Footer() {
  const { hfTheme } = useContext(StateContext);

  return <div className={`border-t-[1px] p-4 gap-2 flex-center min-h-[75px] ${hfTheme}`}>
    <a className='tracking-tighest opacity-70 hover:opacity-100' href="mailto:jjdcooper6@gmail.com">Have more photos of Ian? Send them here!</a>
    <p className='opacity-50 font-light'>© {new Date().getFullYear()}</p>
  </div>
}

function App() {
  const [hfTheme, sethfTheme] = useState('bg-gray-800 text-white');

  return (
    <>
      <StateContext.Provider value={{hfTheme, sethfTheme}}>

        <div className='justify-between flex flex-col min-h-screen'>
          <Header />

          <div className='flex-center'>
            <Routes>
              <Route path='/' element={<Remembering />} />
              <Route path='/obituary' element={<Obituary />} />
              <Route path='/art' element={<ArtDivider />} />
              <Route path='/photos' element={<Photos />} />
              <Route path='/donate' element={<Donate />} />
            </Routes>
          </div>

          {/* <ArtDivider /> */}
          <Footer />
        </div>

      </StateContext.Provider>
    </>
  )
}

export default App
