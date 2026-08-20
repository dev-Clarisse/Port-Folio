import { IoLogoLinkedin } from "react-icons/io";
import { FaGithub } from "react-icons/fa";
import { AtSign, ContactRound } from "lucide-react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import { Sound } from "@/Hooks/Sound"


export default function Footer() {

  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const playClick = Sound("/sounds/clic.mp3");

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;

    setStatus("sending");

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setStatus("success");
        form.current?.reset();
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
      });
  };

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 bg-[#1a1025] text-white/80 px-10 py-4 flex flex-col sm:flex-row justify-between gap-10 ">


      <nav>
        <div className="flex flex-col items-center gap-3">

          <div className="flex gap-5">
            <Dialog>

              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    playClick();
                  }}
                  className="btn-glossy transition-all duration-300 hover:drop-shadow-[0_0_20px_var(--wisteria-2)]">
                  <ContactRound />
                  Contact me
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-[#1a1025] text-white border-[var(--lavender-purple)]">
                <DialogHeader>
                  <DialogTitle className="text-[var(--lavender-purple)]">
                    Send me your message
                  </DialogTitle>
                </DialogHeader>

                <form ref={form} onSubmit={sendEmail} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="recruiter_email" className="text-sm text-[var(--white)]/70">
                      your email address
                    </label>
                    <input
                      id="recruiter_email"
                      name="recruiter_email"
                      type="email"
                      placeholder="recruiter@company.com"
                      required
                      className="bg-white/5 border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--lavender-purple)]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="recruiter_message" className="text-sm text-[var(--white)]/70">
                      Message
                    </label>
                    <textarea
                      id="recruiter_message"
                      name="recruiter_message"
                      rows={4}
                      placeholder="Your message..."
                      required
                      className="bg-white/5 border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--lavender-purple)]"
                    />
                  </div>

                  <Button
                    onClick={() => {
                      playClick();
                    }}
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-glossy hover:drop-shadow-[0_0_20px_var(--wisteria-2)] transition-all duration-300"
                  >
                    {status === "sending" ? "Sending..." : "Send"}
                  </Button>

                  {status === "success" && (
                    <p className="text-sm text-green-400">Message sent ✓</p>
                  )}
                  {status === "error" && (
                    <p className="text-sm text-red-400">Error. Please try again later</p>
                  )}

                </form>



              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      <nav>
        <div className="flex items-center gap-4">
          <AtSign size={20} className="text-lg font-semibold text-[var(--lavender-purple)]" />
          <p>clarisse15032004@gmail.com</p>
        </div>
      </nav>

      <nav >
        <div className="flex  items-center gap-4">
          <h6 className="text-lg font-semibold text-[var(--lavender-purple)]">
            Réseaux
          </h6>
          <div className="flex gap-2">

            <a href="https://github.com/dev-Clarisse" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_8px_var(--lavender-purple)] transition">
              <FaGithub size={20} />

            </a>



            <a href="https://linkedin.com/in/clarisse-del-castillo" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_8px_var(--lavender-purple)] transition">
              <IoLogoLinkedin size={20} />
            </a>




          </div>
        </div>
      </nav>


    </footer>
  );
}