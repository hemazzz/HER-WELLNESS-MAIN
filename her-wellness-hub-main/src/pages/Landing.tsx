import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Brain, Flower2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <div className="min-h-screen gradient-soft">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-full gradient-pink flex items-center justify-center shadow-lg shadow-primary/30">
            <Heart className="w-12 h-12 text-primary-foreground" fill="white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-tight"
        >
          Her Wellness
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-md font-light"
        >
          AI Powered Women's Health Virtual Assistant
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-sm"
        >
          <Button asChild size="lg" className="flex-1 gradient-pink text-primary-foreground border-0 text-base h-12 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="flex-1 border-primary/30 text-primary hover:bg-accent text-base h-12 rounded-full">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl w-full"
        >
          {[
            { icon: Heart, label: 'Health Tracking' },
            { icon: Shield, label: 'Period Tracker' },
            { icon: Brain, label: 'AI Assistant' },
            { icon: Flower2, label: 'Diet Plans' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
