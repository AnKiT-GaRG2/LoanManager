import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, Calculator, CreditCard, BarChart3, Shield, Zap } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Ready to manage your loans professionally?
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="border-b border-border bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-primary mr-2" />
              <span className="text-2xl font-bold text-foreground">LoanManager</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Professional Loan Management
            <span className="block text-primary">Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Calculate EMIs, track payments, and manage multiple loans with our comprehensive 
            loan management platform. Perfect for individuals and financial professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="professional" size="lg" className="text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <Calculator className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Smart EMI Calculator</CardTitle>
              <CardDescription>
                Calculate any missing value with our intelligent EMI calculator. 
                Support for both EMI and interest-only loans.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CreditCard className="h-12 w-12 text-secondary mb-4" />
              <CardTitle>Loan Tracking</CardTitle>
              <CardDescription>
                Track multiple loans, record payments, and monitor remaining balances 
                with detailed payment histories.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Payment Analytics</CardTitle>
              <CardDescription>
                Get insights into your payment patterns, interest vs principal breakdown, 
                and loan performance metrics.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4 p-6 bg-gradient-card rounded-lg border border-border">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">Your data stays local and secure</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-6 bg-gradient-card rounded-lg border border-border">
            <Zap className="h-8 w-8 text-secondary" />
            <div>
              <h3 className="font-semibold text-foreground">Real-time Calculations</h3>
              <p className="text-sm text-muted-foreground">Instant EMI and schedule updates</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-6 bg-gradient-card rounded-lg border border-border">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Professional Interface</h3>
              <p className="text-sm text-muted-foreground">Clean, intuitive design</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-gradient-primary rounded-lg shadow-elegant">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-primary-foreground/90 mb-6 text-lg">
            Join professionals who trust LoanManager for their loan calculations and tracking.
          </p>
          <Link to="/register">
            <Button variant="secondary" size="lg" className="text-lg px-8 py-3">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
