import '@/App.css'
import { useLayoutEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Sound } from "@/Hooks/Sound"

import { CalendarDays, MapPin, BookOpenText, School, GraduationCap, Code } from "lucide-react";
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
import FlowerPath from '@/components/layout/FlowerPath/FlowerPath';


function Academic() {


    const playClick = Sound("/sounds/clic.mp3");

    const containerRef = useRef<HTMLDivElement>(null);
    const box1Ref = useRef<HTMLDivElement>(null);
    const box2Ref = useRef<HTMLDivElement>(null);
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
    // const [pageHeight, setPageHeight] = useState<number | null>(null);
    
    useLayoutEffect(() => {
        const container = containerRef.current;
        const boxes = [box1Ref.current, box2Ref.current];
        if (!container || boxes.some((b) => !b)) return;

        const containerRect = container.getBoundingClientRect();
        setPoints(
            boxes.map((box) => {
                const rect = box!.getBoundingClientRect();
                return {
                    x: rect.left + rect.width / 2 - containerRect.left,
                    y: rect.top + rect.height / 2 - containerRect.top,
                };
            })
        );

    }, []);

    return (

        <div ref={containerRef} className="relative max-w-4xl mx-auto px-4 py-12">
            <div className="flex flex-col gap-6">

                {points.length === 2 && <FlowerPath points={points} />}

                <div
                    ref={box2Ref}
                    className="bg-[#180e29]/90 backdrop-blur-md border border-lilac-800/40 rounded-xl p-6 shadow-lg transition-all duration-300 hover:border-lilac-500/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-lilac-900/60">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-lilac-950 border border-lilac-800/50 text-lilac-300 shrink-0">
                                <School size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-lilac-100">
                                    Master of Science in General Engineering
                                </h3>
                                <p className="text-sm font-medium text-lilac-400">
                                    EPF Paris-Cachan
                                </p>
                            </div>
                        </div>
                        <span className="self-start sm:self-auto px-3 py-1 text-xs font-semibold rounded-full bg-lilac-950/80 text-lilac-300 border border-lilac-700/50 flex items-center gap-1.5 shrink-0">
                            <CalendarDays size={14} className="text-lilac-400" />
                            Sept 2022 – Nov 2027
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2 text-sm text-lilac-200/90">
                            <div className="flex items-center gap-2">
                                <MapPin className="text-lilac-400 shrink-0" size={16} />
                                <span>Cachan, France</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Code className="text-lilac-400 shrink-0" size={16} />
                                <span>Specialization: Digital and Intelligent Systems</span>
                            </div>
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

                {/* CARD 1 - High School */}
                <div
                    ref={box1Ref}
                    className="bg-[#180e29]/90 backdrop-blur-md border border-lilac-800/40 rounded-xl p-6 shadow-lg transition-all duration-300 hover:border-lilac-500/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-lilac-900/60">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-lilac-950 border border-lilac-800/50 text-lilac-300 shrink-0">
                                <GraduationCap size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-lilac-100">
                                    Lycée Louis Thuillier
                                </h3>
                                <p className="text-sm font-medium text-lilac-400">
                                    French Baccalaureate — High Honors
                                </p>
                            </div>
                        </div>
                        <span className="self-start sm:self-auto px-3 py-1 text-xs font-semibold rounded-full bg-lilac-950/80 text-lilac-300 border border-lilac-700/50 flex items-center gap-1.5 shrink-0">
                            <CalendarDays size={14} className="text-lilac-400" />
                            Sept 2019 – July 2022
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-lilac-200/90">
                        <div className="flex items-center gap-2">
                            <MapPin className="text-lilac-400 shrink-0" size={16} />
                            <span>Amiens, France</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BookOpenText className="text-lilac-400 shrink-0" size={16} />
                            <span>European classes</span>
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2">
                            <BookOpenText className="text-lilac-400 shrink-0" size={16} />
                            <span>Science specialities, Advanced Mathematics</span>
                        </div>
                    </div>
                </div>

                {/* CARD 2 - Engineering Degree */}


            </div>
        </div>


    );
}

export default Academic

