import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AuthModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col items-center justify-center p-6">
          <h2 className="text-2xl font-bold mb-6">Get Started with Comedi.ai</h2>
          <div className="flex flex-col gap-4 w-full">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white"
              onClick={() => window.location.href = '/signup.html'}
            >
              Sign Up
            </Button>
            <Button 
              className="w-full bg-secondary hover:bg-secondary/90 text-white"
              onClick={() => window.location.href = '/signin.html'}
            >
              Sign In
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 