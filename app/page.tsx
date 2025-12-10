import React from 'react';
import { PlayCircle } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div 
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center text-center px-4"
        style={{ backgroundImage: 'url("https://picsum.photos/seed/religious/1920/1080")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/70 to-transparent"></div>
        <div className="relative z-10 text-white max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg text-amber-400 font-serif">
            حسینیه فراشان حضرت ابوالفضل العباس (ع)
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100 font-light leading-relaxed">
            به پایگاه رسانه‌ای هیئت خوش آمدید. مجموعه‌ای از بهترین منقبت‌خوانی‌های افغانستانی و سخنرانی‌های مذهبی.
            اینجا محلی برای نشر معارف اهل بیت (ع) و ترویج فرهنگ عاشورایی است.
          </p>
          <div className="flex gap-4 justify-center">
             <a href="#about" className="bg-white text-primary-900 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition">درباره ما</a>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <section id="about" className="py-16 px-6 bg-white">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-primary-100 inline-block pb-2">فراشان مدیا چیست؟</h2>
            <div className="grid md:grid-cols-2 gap-8 text-right">
               <div className="bg-primary-50 p-6 rounded-2xl">
                  <h3 className="font-bold text-xl mb-3 text-primary-800">منقبت خوانی افغانستانی</h3>
                  <p className="text-gray-600 leading-7">
                    منقبت‌خوانی یکی از سنت‌های دیرینه و زیبای مردم افغانستان در مدح اهل‌بیت (ع) است. 
                    ما در تلاشیم تا گنجینه‌ای از این آثار ارزشمند را با کیفیت بالا جمع‌آوری کرده و در اختیار عاشقان اهل بیت قرار دهیم.
                  </p>
               </div>
               <div className="bg-amber-50 p-6 rounded-2xl">
                  <h3 className="font-bold text-xl mb-3 text-amber-800">اهداف سایت</h3>
                  <p className="text-gray-600 leading-7">
                    این پلتفرم فضایی است برای اشتراک‌گذاری محتوای مذهبی صوتی و تصویری. 
                    شما می‌توانید به عنوان خادم اهل بیت، آثار خود را با دیگران به اشتراک بگذارید و در نشر این فرهنگ سهیم باشید.
                  </p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;