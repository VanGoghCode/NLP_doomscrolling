import NextLink from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Header, Footer } from "@/components/layout";
import {
  Button,
  Card,
  CardBody,
} from "@heroui/react";

export default function Home() {
  return (
    <div className="bg-background bg-texture-dots text-foreground selection:bg-primary selection:text-white">
      {/* Shared Header */}
      <Header variant="floating" />

      {/* Hero section - 100vh */}
      <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Animated Glowing Circles Background */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          {/* Large primary orb - center */}
          <div className="glow-orb glow-orb-primary w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" />
          
          {/* Floating amber orb - top right */}
          <div className="glow-orb glow-orb-amber w-[300px] h-[300px] top-[10%] right-[10%] animate-float-slow" style={{ animationDelay: '0s' }} />
          
          {/* Floating orange orb - bottom left */}
          <div className="glow-orb glow-orb-orange w-[250px] h-[250px] bottom-[15%] left-[5%] animate-float" style={{ animationDelay: '2s' }} />
          
          {/* Small drifting orb - top left */}
          <div className="glow-orb glow-orb-primary w-[150px] h-[150px] top-[20%] left-[15%] animate-drift opacity-60" style={{ animationDelay: '1s' }} />
          
          {/* Small floating orb - bottom right */}
          <div className="glow-orb glow-orb-amber w-[200px] h-[200px] bottom-[25%] right-[15%] animate-float-fast" style={{ animationDelay: '3s' }} />
          
          {/* Tiny accent orb */}
          <div className="glow-orb glow-orb-rose w-[100px] h-[100px] top-[40%] right-[25%] animate-float-slow opacity-50" style={{ animationDelay: '4s' }} />
        </div>

        <div className="text-center max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-stone-900 mb-8 tracking-tighter leading-[0.9] text-glow-dark">
            WAKE UP FROM <br />
            <span className="text-primary relative inline-block animate-text-glow">
              THE SCROLL
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-primary/20"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-stone-600 max-w-2xl mx-auto mb-12 leading-relaxed font-serif italic">
            &quot;You are trading your life for pixels. Seconds turn into hours,
            hours into regrets. It&apos;s time to reclaim your reality.&quot;
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Button
              as={NextLink}
              href="/assessment"
              size="lg"
              className="bg-primary text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
              endContent={<Icon name="ArrowRight" className="w-5 h-5" />}
            >
              Break the Cycle
            </Button>
            <Button
              as={NextLink}
              href="#truth"
              variant="light"
              size="lg"
              className="text-stone-600 font-medium hover:text-primary"
            >
              See the Truth
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-stone-400 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-stone-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* The Truth Section - 100vh */}
      <section id="truth" className="min-h-screen flex flex-col justify-center px-4 bg-white bg-texture-hexagon relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="glow-orb glow-orb-amber w-[400px] h-[400px] top-[20%] left-[-10%] animate-float-slow opacity-30" />
          <div className="glow-orb glow-orb-primary w-[300px] h-[300px] bottom-[10%] right-[-5%] animate-drift opacity-25" />
        </div>

        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-stone-900 mb-6 tracking-tight text-glow-dark">
              The Uncomfortable <span className="text-primary text-glow-primary">Truth</span>
            </h2>
            <p className="text-xl text-stone-500 max-w-2xl mx-auto">
              What scrolling is really costing you-beyond just time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-stone-50 border-none shadow-none hover:bg-primary/5 transition-colors duration-500 group">
              <CardBody className="p-8">
                <Icon
                  name="Clock"
                  className="w-10 h-10 text-stone-400 mb-6 group-hover:text-primary transition-colors"
                />
                <h3 className="text-2xl font-bold text-stone-900 mb-4 group-hover:text-glow-primary transition-all">
                  The Lost Time
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  The average person spends 2.5 hours on social media daily.
                  That&apos;s 38 days a year. What could you build in 38 days?
                </p>
              </CardBody>
            </Card>
            <Card className="bg-stone-50 border-none shadow-none hover:bg-primary/5 transition-colors duration-500 group">
              <CardBody className="p-8">
                <Icon
                  name="Activity"
                  className="w-10 h-10 text-stone-400 mb-6 group-hover:text-primary transition-colors"
                />
                <h3 className="text-2xl font-bold text-stone-900 mb-4 group-hover:text-glow-primary transition-all">
                  The Mental Fog
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Constant dopamine hits fragment your attention span. You&apos;re
                  training your brain to be distracted, anxious, and numb.
                </p>
              </CardBody>
            </Card>
            <Card className="bg-stone-50 border-none shadow-none hover:bg-primary/5 transition-colors duration-500 group">
              <CardBody className="p-8">
                <Icon
                  name="Eye"
                  className="w-10 h-10 text-stone-400 mb-6 group-hover:text-primary transition-colors"
                />
                <h3 className="text-2xl font-bold text-stone-900 mb-4 group-hover:text-glow-primary transition-all">
                  The Real Connection
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Likes aren&apos;t love. Comments aren&apos;t conversations. Disconnect
                  to reconnect with the people who actually matter.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section - 100vh */}
      <section className="min-h-screen flex flex-col justify-center px-4 bg-stone-50 bg-texture-circuit relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="glow-orb glow-orb-orange w-[350px] h-[350px] top-[30%] right-[5%] animate-float opacity-20" />
          <div className="glow-orb glow-orb-primary w-[250px] h-[250px] bottom-[20%] left-[10%] animate-drift opacity-25" />
        </div>

        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-stone-900 mb-6 tracking-tight text-glow-dark">
              By The <span className="text-primary text-glow-primary">Numbers</span>
            </h2>
            <p className="text-xl text-stone-500 max-w-2xl mx-auto">
              Research-backed data on doomscrolling&apos;s impact on mental health.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow group">
              <div className="text-5xl md:text-6xl font-black text-primary mb-2 text-glow-primary group-hover:animate-text-glow">
                401
              </div>
              <p className="text-stone-600 font-medium">
                research participants in our doomscrolling study
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow group">
              <div className="text-5xl md:text-6xl font-black text-primary mb-2 text-glow-primary group-hover:animate-text-glow">
                70%
              </div>
              <p className="text-stone-600 font-medium">
                show moderate doomscrolling patterns
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow group">
              <div className="text-5xl md:text-6xl font-black text-primary mb-2 text-glow-primary group-hover:animate-text-glow">
                4.16
              </div>
              <p className="text-stone-600 font-medium">
                average &quot;coping&quot; score (using scrolling to regulate emotions)
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow group">
              <div className="text-5xl md:text-6xl font-black text-primary mb-2 text-glow-primary group-hover:animate-text-glow">
                3.55
              </div>
              <p className="text-stone-600 font-medium">
                overall mean score (above neutral on 1-7 scale)
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-stone-400 text-sm mb-4">
              Authentic data from &quot;The Dark at the End of the Tunnel&quot; study (n=401 participants)
            </p>
            <Button
              as={NextLink}
              href="/assessment"
              variant="bordered"
              className="border-primary text-primary hover:bg-primary hover:text-white transition-all"
            >
              See Where You Stand
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section - 100vh */}
      <section className="min-h-screen flex flex-col justify-center px-4 bg-white bg-texture-waves relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="glow-orb glow-orb-amber w-[300px] h-[300px] top-[15%] left-[5%] animate-float-slow opacity-25" />
          <div className="glow-orb glow-orb-rose w-[200px] h-[200px] bottom-[25%] right-[10%] animate-drift opacity-20" />
        </div>

        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-stone-900 mb-6 tracking-tight text-glow-dark">
              How It <span className="text-primary text-glow-primary">Works</span>
            </h2>
            <p className="text-xl text-stone-500 max-w-2xl mx-auto">
              Three simple steps to understand and improve your digital habits.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <span className="text-3xl font-black text-primary">1</span>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">Take the Assessment</h3>
              <p className="text-stone-600 leading-relaxed">
                Answer 24 research-backed questions about your scrolling habits. 
                It only takes 5-7 minutes to complete.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <span className="text-3xl font-black text-primary">2</span>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">Get Predictive Insights</h3>
              <p className="text-stone-600 leading-relaxed">
                See your scores across 8 dimensions, predictive risk analysis,
                and compare to research data from 401 participants.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <span className="text-3xl font-black text-primary">3</span>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">Take Action</h3>
              <p className="text-stone-600 leading-relaxed">
                Receive personalized recommendations based on your specific 
                problem areas. Small changes, big impact.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button
              as={NextLink}
              href="/assessment"
              size="lg"
              className="bg-primary text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
              endContent={<Icon name="ArrowRight" className="w-5 h-5" />}
            >
              Start Your Assessment
            </Button>
          </div>
        </div>
      </section>

      {/* CTA section - 100vh */}
      <section className="min-h-screen flex flex-col justify-center px-4 bg-stone-900 text-stone-100 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-texture-diagonal opacity-50"></div>
        
        {/* Glowing circles for CTA section */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="glow-orb glow-orb-primary w-[400px] h-[400px] top-1/2 left-1/4 -translate-y-1/2 animate-float-slow opacity-30" />
          <div className="glow-orb glow-orb-orange w-[300px] h-[300px] top-1/3 right-[20%] animate-drift opacity-25" style={{ animationDelay: '2s' }} />
          <div className="glow-orb glow-orb-amber w-[200px] h-[200px] bottom-[20%] left-[10%] animate-float opacity-20" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight text-glow-white">
            Are you ready to <br />
            <span className="text-primary text-glow-primary-strong">live again?</span>
          </h2>
          <p className="text-xl text-stone-400 mb-8 max-w-xl mx-auto">
            The assessment takes 5-7 minutes. The insight lasts a lifetime.
          </p>
          <p className="text-lg text-stone-500 mb-12 max-w-2xl mx-auto font-serif italic">
            &quot;The first step to changing your behavior is understanding it. 
            Stop doomscrolling through life-start living it.&quot;
          </p>
          <Button
            as={NextLink}
            href="/assessment"
            size="lg"
            className="bg-white text-stone-900 font-bold text-lg px-10 py-8 rounded-full hover:bg-primary hover:text-white transition-all shadow-glow"
          >
            Start My Recovery
          </Button>
        </div>
      </section>

      {/* Shared Footer */}
      <Footer variant="full" />
    </div>
  );
}
