import '@/App.css'
import imageMe from '@/assets/me.jpeg'
import FlowerBox from '@/components/Box/FlowerBox';
import FlowerBoxMe from '@/components/Box/FlowerBoxMe';





function AboutMe() {

    return (
        <div className="flex flex-col">

            <div style={{ position: 'relative', paddingTop: '90px', paddingLeft: '550px' }}>

                <h1 className="neon-2 hello font-citation  text-lilac-950">
                    Hi !
                </h1>
                <h1 className="neon-2 name font-citation  text-lilac-950">
                    I'm Clarisse Del Castillo
                </h1>

                <div className="flex flex-col gap-4">

                    <div className="flex ">

                        <div className="relative -mt-[30px] -ml-[400px] w-90 h-90 mx-auto animate-slide-in-left">
                            <FlowerBoxMe className="absolute inset-0 w-full h-full" image={imageMe} />


                        </div>

                        <div className="relative -mt-[70px] -mr-[-200px] w-150 h-150 mx-auto animate-slide-in-right">
                            <FlowerBox className="absolute inset-0 w-full h-full" />

                            <div className="absolute inset-0 z-10 flex items-center justify-center">
                                <div className="flex flex-col gap-6 w-80 text-center leading-snug ">
                                    <p className='text-lilac-1000 text-2xl'>
                                        About me...
                                    </p>
                                    <div className='text-lilac-100 text-lg flex flex-col gap-7'>
                                        <div className='flex'>
                                            born on March 15, 2004, in Ermont, in the Val-d'Oise department (95). 22 years old.
                                        </div>
                                        <div className='flex'>
                                            fourth year at EPF, a general engineering school.
                                            majoring in Digital and Intelligent Systems.
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>



                    </div>








                </div>
            </div >

        </div >
    );
}

export default AboutMe