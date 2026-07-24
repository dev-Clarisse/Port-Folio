import '@/App.css'
import FlowerBox from '@/components/Box/FlowerBox';
import { Button } from "@/components/ui/button"
import { Sound } from "@/Hooks/Sound"
import { CalendarDays, MapPin, BookOpenText, School } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


function Academic() {
    const playClick = Sound("/sounds/clic.mp3");
    return (
        <div className="flex flex-col">
            <div style={{ position: 'relative', paddingTop: '90px', paddingLeft: '550px' }}>
                <div className="flex flex-col gap-4">
                    <div className="flex ">

                        <div className="relative -mt-[100px] -ml-[430px]  w-100 h-100 mx-auto ">
                            <FlowerBox className="absolute inset-0 w-full h-full" />

                            <div className="absolute inset-0 z-10 flex items-center justify-center">
                                <div className="flex flex-col gap-6 w-52 text-center text-lilac-100 text-lg leading-snug ">
                                    <p className='text-lilac-1000'>
                                        Lycée Louis Thuillier
                                    </p>
                                    <div className='text-base flex flex-col gap-1'>
                                        <div className='flex gap-2'>
                                            <CalendarDays size={20} />
                                            Sept 2019 – July 2022
                                        </div>
                                        <div className='flex gap-2'>
                                            <MapPin size={20} />
                                            Amiens
                                        </div>
                                        <div className='flex gap-2'>
                                            <BookOpenText size={20} />
                                            European classes
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>

                        <div className="relative -mt-[100px] -mr-[-100px] w-100 h-100 mx-auto">
                            <FlowerBox className="absolute inset-0 w-full h-full" />

                            <div className="absolute inset-0 z-10 flex items-center justify-center">
                                <div className="flex flex-col gap-6 w-48 text-center text-lilac-100 text-lg leading-snug">

                                    <p className='text-lilac-1000'>
                                        French Baccalaureate
                                    </p>
                                    <div className='text-base flex flex-col gap-1'>
                                        <div className='flex gap-2'>
                                            <BookOpenText size={20} />
                                            High Honors
                                        </div>

                                        <div className='flex gap-2'>
                                            <CalendarDays size={20} />
                                            July 2022
                                        </div>
                                        <div className='flex gap-2'>
                                            <MapPin size={20} />
                                            Amiens
                                        </div>
                                        <div className='text-sm flex gap-2 items-start'>
                                            <BookOpenText size={20} className='shrink-0' />
                                            Science specialities, Advanced Mathematics
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>



                    </div>

                    <div className='flex '>

                        <div className="relative -mt-[80px] -ml-[200px] w-100 h-100 mx-auto ">
                            <FlowerBox className="absolute inset-0 w-full h-full" />

                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
                                <div className="flex flex-col gap-6 w-54 text-center text-lilac-100 text-xl leading-snug">
                                    <p className='text-lilac-1000'>
                                        Bachelor of Science in General Engineering
                                    </p>
                                    <div className='text-base flex flex-col gap-1'>

                                        <div className='flex gap-2'>
                                            <CalendarDays size={20} />
                                            Sept 2022 - Nov 2027
                                        </div>
                                        <div className='flex gap-2 items-start'>
                                            <School size={20} className=' shrink-0' />
                                            EPF Paris-Cachan
                                        </div>
                                        <div className='flex gap-2 items-start'>
                                            <MapPin size={20} className=' shrink-0' />
                                            Cachan
                                        </div>
                                        <div className=' flex gap-2 '>
                                            <BookOpenText size={20} />
                                            current training
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>

                        <div className="relative -mt-[80px] -ml-[240px] w-100 h-100 mx-auto ">
                            <FlowerBox className="absolute inset-0 w-full h-full" />

                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-7">
                                <div className='w-48 text-center text-xl leading-snug text-lilac-1000'>
                                    Digital and Intelligent Systems
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            onClick={() => {
                                                playClick();
                                            }}
                                            className=" text-base btn-glossy bg-lilac-950 text-lilac-100  transition-all duration-300 hover:drop-shadow-[0_0_20px_var(--color-lilac-400)]">
                                            Syllabus
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent className="justify-center bg-[#1a1025] text-white border-[var(--lavender-purple)] h-[65vh] sm:max-w-[700px] flex flex-col">
                                        <DialogHeader>
                                            <DialogTitle className="text-[var(--lavender-purple)]">
                                                Course Syllabus
                                            </DialogTitle>

                                        </DialogHeader>

                                        <p className="text-sm text-[var(--white)]/70">
                                            4th year
                                        </p>


                                        <div className="flex gap-4 flex-1 min-h-0 overflow-y-auto">
                                            <div className="flex-column w-full">
                                                <Accordion type="single" collapsible className="w-full">


                                                    <AccordionItem value="java" className="border-lilac-800">
                                                        <AccordionTrigger >
                                                            Java Programming Language
                                                        </AccordionTrigger>
                                                        <AccordionContent className="text-black">
                                                            Backend development with Spring Boot.
                                                            Database integration via JPA/Hibernate.
                                                        </AccordionContent>
                                                    </AccordionItem>

                                                    <AccordionItem value="mobile-materials" className="border-lilac-800">
                                                        <AccordionTrigger >
                                                            Mobile Materials
                                                        </AccordionTrigger>
                                                        <AccordionContent className="text-black">
                                                            Kotlin application development.
                                                            Experience with libraries such as OSMDroid for map integration.
                                                        </AccordionContent>
                                                    </AccordionItem>

                                                    <AccordionItem value="angular-js" className="border-lilac-800">
                                                        <AccordionTrigger >
                                                            Angular and JS
                                                        </AccordionTrigger>
                                                        <AccordionContent className="text-black">
                                                            Front-end development with Angular and TypeScript.
                                                            Creation of reusable components, service management, routing, and communication with REST APIs.
                                                        </AccordionContent>
                                                    </AccordionItem>

                                                    <AccordionItem value="symfony" className="border-lilac-800">
                                                        <AccordionTrigger >
                                                            Symfony Web Development
                                                        </AccordionTrigger>
                                                        <AccordionContent className="text-black">
                                                            Development of an e-commerce website.
                                                            Product, shopping cart, and order management.
                                                            Integration of the Stripe payment API.
                                                        </AccordionContent>
                                                    </AccordionItem>


                                                </Accordion>
                                            </div>
                                            {/* <div className="flex-column"> */}
                                            <div className="flex-column w-full">
                                                <Accordion type="single" collapsible className="w-full">

                                                    <AccordionItem value="git" className="border-lilac-800">
                                                        <AccordionTrigger >
                                                            Git and Version Control
                                                        </AccordionTrigger>
                                                        <AccordionContent className="text-black">
                                                            Robust Git workflow : interactive rebase, commit squash, controlled force push, conflict resolution.

                                                        </AccordionContent>
                                                    </AccordionItem>

                                                    <AccordionItem value="apis" className="border-lilac-800">
                                                        <AccordionTrigger >
                                                            API's Architecture
                                                        </AccordionTrigger>
                                                        <AccordionContent className="text-black">
                                                            Design and Use of REST APIs
                                                            Endpoint structuring, JSON response format handling
                                                        </AccordionContent>
                                                    </AccordionItem>




                                                    <AccordionItem value="unix-linux" className="border-lilac-800">
                                                        <AccordionTrigger >
                                                            UNIX and LINUX Systems
                                                        </AccordionTrigger>
                                                        <AccordionContent className="text-black">
                                                            Daily use of the terminal.
                                                            Using Linux commands on Ubuntu.
                                                        </AccordionContent>
                                                    </AccordionItem>

                                                    <AccordionItem value="ai" className="border-lilac-800">
                                                        <AccordionTrigger >
                                                            Artificial Intelligence
                                                        </AccordionTrigger>
                                                        <AccordionContent className="text-black">
                                                            Python for Data Science (pandas, NumPy, scikit-learn, matplotlib).
                                                            Work on machine learning models.
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>

                                            </div>



                                        </div>

                                    </DialogContent>

                                </Dialog>


                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>


    )
}

export default Academic