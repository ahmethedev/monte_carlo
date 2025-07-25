import React from 'react';
import { Check, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with Monte Carlo simulations',
      features: [
        '5 simulations per month',
        'Basic portfolio analysis',
        'Standard market data',
        'Email support',
        'Basic risk metrics'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'secondary',
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'Advanced features for serious traders and analysts',
      features: [
        'Unlimited simulations',
        'Advanced portfolio optimization',
        'Real-time market data',
        'Priority support',
        'Advanced risk analytics',
        'Custom scenarios',
        'Export capabilities',
        'API access'
      ],
      buttonText: 'Start Free Trial',
      buttonVariant: 'primary',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'Tailored solutions for large organizations',
      features: [
        'Everything in Pro',
        'Custom integrations',
        'Dedicated support',
        'Team management',
        'Advanced security',
        'SLA guarantee',
        'Training & onboarding',
        'Custom reporting'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'secondary',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="section-padding bg-dark-900/50">
      <div className="content-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-gradient mb-6">
            Choose Your Plan
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Start with our free plan and upgrade as your trading strategies grow more sophisticated
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`
                relative p-8 rounded-3xl border transition-all duration-300 hover:scale-105
                ${plan.popular 
                  ? 'bg-gradient-to-b from-primary-600/10 to-primary-800/5 border-primary-500/50 shadow-glow' 
                  : 'bg-dark-800/50 border-dark-700 hover:border-dark-600'
                }
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  {plan.period !== 'contact us' && (
                    <span className="text-neutral-400 ml-2">/{plan.period}</span>
                  )}
                </div>
                <p className="text-neutral-400">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`
                  w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold transition-all duration-300
                  ${plan.buttonVariant === 'primary'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-glow-lg'
                    : 'bg-dark-700 text-neutral-200 hover:bg-dark-600 border border-dark-600'
                  }
                `}
              >
                {plan.popular && <Zap className="w-4 h-4" />}
                <span>{plan.buttonText}</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-neutral-400 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-neutral-500">
            <span>✓ Cancel anytime</span>
            <span>✓ No setup fees</span>
            <span>✓ 24/7 support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;