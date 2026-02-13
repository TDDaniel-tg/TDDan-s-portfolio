import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
    return (
        <>
            <Preloader />
            <CustomCursor />
            <SmoothScroll>
                <Navbar />
                <main>
                    <Hero />
                    <Marquee />
                    <About />
                    <Skills />
                    <Projects />
                    <Experience />
                    <Contact />
                </main>
                <Footer />
            </SmoothScroll>
        </>
    );
}
