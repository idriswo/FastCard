import { memo } from 'react'
import { useTranslation } from 'react-i18next';
import { Store, DollarSign, ShoppingBag } from 'lucide-react'; // Барои иконкаҳо
import { useNavigate } from 'react-router-dom';
import img1 from "../../assets/Side Image.png"
import { Truck, Headphones, ShieldCheck } from 'lucide-react';
import { FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import img11 from '../../assets/088149fd5afc043392ee3cbb529f429b3e2098d3.png'
import img12 from '../../assets/8438eab9a2fe88af0272adecd83422d0cb7e20d7.png'
import img13 from '../../assets/ede48f2b5df8103b281240ce5bafe5dd7d215ab8 (2).png'

const About = memo(() => {
   const navigate = useNavigate();
  const { t } = useTranslation();
  const stats = [
    {
      id: 1,
      icon: <Store className="w-8 h-8" />,
      value: "10.5k",
      label: t('about.sellersActive', "Sallers active our site"),
      isActive: false,
    },
    {
      id: 2,
      icon: <DollarSign className="w-8 h-8" />,
      value: "33k",
      label: t('about.monthlySale', "Mopnthly Produduct Sale"),
      isActive: true, 
    },
    {
      id: 3,
      icon: <ShoppingBag className="w-8 h-8" />,
      value: "45.5k",
      label: t('about.customersActive', "Customer active in our site"),
      isActive: false,
    },
    {
      id: 4,
      icon: <span className="text-xl font-bold">$</span>, 
      value: "25k",
      label: t('about.annualGross', "Anual gross sale in our site"),
      isActive: false,
    },
  ];

  const features = [
    {
      id: 1,
      icon: <Truck className="w-7 h-7 text-white" />,
      title: t('home.freeDelivery', "FREE AND FAST DELIVERY"),
      description: t('home.freeDeliveryDesc', "Free delivery for all orders over $140")
    },
    {
      id: 2,
      icon: <Headphones className="w-7 h-7 text-white" />,
      title: t('home.customerService', "24/7 CUSTOMER SERVICE"),
      description: t('home.customerServiceDesc', "Friendly 24/7 customer support")
    },
    {
      id: 3,
      icon: <ShieldCheck className="w-7 h-7 text-white" />,
      title: t('home.moneyBack', "MONEY BACK GUARANTEE"),
      description: t('home.moneyBackDesc', "We return money within 30 days")
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: "Tom Cruise",
      role: t('about.founder', "Founder & Chairman"),
      image: img11,
      socials: { twitter: "#", instagram: "#", linkedin: "#" }
    },
    {
      id: 2,
      name: "Emma Watson",
      role: t('about.managingDirector', "Managing Director"),
      image: img12,
      socials: { twitter: "#", instagram: "#", linkedin: "#" }
    },
    {
      id: 3,
      name: "Will Smith",
      role: t('about.productDesigner', "Product Designer"),
      image: img13,
      socials: { twitter: "#", instagram: "#", linkedin: "#" }
    },
    // {
    //   id: 4,
    //   name: "Tom Cruise",
    //   role: "Founder & Chairman",
    //   image: img11,
    //   socials: { twitter: "#", instagram: "#", linkedin: "#" }
    // },
    // {
    //   id: 5,
    //   name: "Emma Watson",
    //   role: "Managing Director",
    //   image: img12,
    //   socials: { twitter: "#", instagram: "#", linkedin: "#" }
    // },
    // {
    //   id: 6,
    //   name: "Will Smith",
    //   role: "Product Designer",
    //   image: img13,
    //   socials: { twitter: "#", instagram: "#", linkedin: "#" }
    // }
  ];


 

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 py-12 font-sans text-[#000000]">

        <nav className="text-sm text-gray-500 dark:text-zinc-400 mb-[30px]">
          <div className='flex items-center gap-[1px]'>
            <p onClick={() => navigate("/")} className="cursor-pointer hover:underline">{t('header.home')}</p>
            <p className="mx-2">/</p>
            <p className="text-black dark:text-white font-medium">{t('header.about')}</p>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">

          <div className="space-y-6 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-black dark:text-white">
              {t('about.ourStory', 'Our Story')}
            </h1>
            <p className="text-base leading-relaxed text-black dark:text-white font-normal">
              {t('about.storyP1', "Launced in 2015, Exclusive is South Asia's premier online shopping makterplace with an active presense in Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sallers and 300 brands and serves 3 millioons customers across the region.")}
            </p>
            <p className="text-base leading-relaxed text-black dark:text-white font-normal">
              {t('about.storyP2', "Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assotment in categories ranging from consumer.")}
            </p>
          </div>

          <div className="w-full h-[200px] md:h-[430px] overflow-hidden rounded-sm">
            <img
              src={img1}
              alt="Two successful women shopping with bags"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className={`flex flex-col items-center justify-center p-8 rounded border transition-all duration-300 ${stat.isActive
                  ? "bg-[#DB4444] text-white border-[#DB4444] shadow-lg shadow-red-200"
                  : "bg-white dark:bg-zinc-900 text-black dark:text-white border-gray-300 dark:border-zinc-700 hover:border-[#DB4444] hover:shadow-md"
                }`}
            >
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full mb-6 transition-colors ${stat.isActive
                    ? "bg-white dark:bg-zinc-900/30 text-white"
                    : "bg-gray-200 text-black dark:text-white group-hover:bg-[#DB4444]/30"
                  }`}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full ${stat.isActive ? "bg-white dark:bg-zinc-900 text-black dark:text-white" : "bg-black text-white"
                    }`}
                >
                  {stat.icon}
                </div>
              </div>

              <h2 className="text-3xl font-bold tracking-wide mb-2">
                {stat.value}
              </h2>
              <p className={`text-sm text-center font-normal ${stat.isActive ? "text-white" : "text-gray-600 dark:text-zinc-300"}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
      <div className="w-full max-w-7xl mx-auto px-[40px] py-16 font-sans text-black dark:text-white">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex flex-col">
              <div className="w-full bg-[#F5F5F5] dark:bg-zinc-800 rounded-sm pt-8 px-6 overflow-hidden h-[430px] flex items-end justify-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="max-h-full object-contain   transition-all duration-300"
                />
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="text-3xl font-medium tracking-wide">{member.name}</h3>
                <p className="text-sm text-gray-600 dark:text-zinc-300 font-normal">{member.role}</p>

                <div className="flex items-center space-x-4 pt-2">
                  <a href={member.socials.twitter} className="text-black dark:text-white hover:text-gray-600 dark:text-zinc-300 transition-colors">
                    <FaTwitter className="w-5 h-5" />
                  </a>
                  <a href={member.socials.instagram} className="text-black dark:text-white hover:text-gray-600 dark:text-zinc-300 transition-colors">
                    <FaInstagram className="w-5 h-5" />
                  </a>
                  <a href={member.socials.linkedin} className="text-black dark:text-white hover:text-gray-600 dark:text-zinc-300 transition-colors">
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center space-x-3 mb-28">
          <div className="w-3 h-3 rounded-full bg-gray-300 cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300 cursor-pointer"></div>
          <div className="w-4 h-4 rounded-full bg-[#DB4444] border-2 border-white ring-2 ring-[#DB4444] cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300 cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300 cursor-pointer"></div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {features.map((feature) => (
            <div key={feature.id} className="flex flex-col items-center text-center">

              <div className="flex items-center justify-center w-[80px] h-[80px] rounded-full bg-gray-200 mb-6">
                <div className="flex items-center justify-center w-[58px] h-[58px] rounded-full bg-black">
                  {feature.icon}
                </div>
              </div>

              <h4 className="text-xl font-bold tracking-wider mb-2">
                {feature.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-zinc-300 font-normal">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </>

  );
})

export default About