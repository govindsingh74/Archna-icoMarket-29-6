import React from 'react';
import { Rocket, Shield, Globe, TrendingUp, Users, Zap } from 'lucide-react';

const GoalSection: React.FC = () => {
  const goals = [
    {
      icon: Rocket,
      title: "Accelerate Innovation",
      description: "Provide a launchpad for revolutionary blockchain projects to reach their full potential and transform industries.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Shield,
      title: "Ensure Security",
      description: "Maintain the highest security standards and conduct thorough due diligence on all listed projects.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Make cryptocurrency investments accessible to everyone, regardless of location or background.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
      icon: TrendingUp,
      title: "Drive Growth",
      description: "Foster sustainable growth in the blockchain ecosystem through strategic partnerships and community building.",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      icon: Users,
      title: "Build Community",
      description: "Create a vibrant ecosystem where investors, developers, and innovators can collaborate and thrive.",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-500/10",
      iconColor: "text-orange-600 dark:text-orange-400"
    },
    {
      icon: Zap,
      title: "Enable Innovation",
      description: "Provide cutting-edge tools and resources that empower projects to succeed in the competitive crypto market.",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-500/10",
      iconColor: "text-yellow-600 dark:text-yellow-400"
    }
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
            Our Goals & Vision
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            We're committed to building the future of decentralized finance by connecting innovative projects 
            with the right investors and providing the tools needed for success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {goals.map((goal, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-white/10 hover:border-slate-300/50 dark:hover:border-white/20"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${goal.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <goal.icon className={`w-8 h-8 ${goal.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {goal.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {goal.description}
              </p>

              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${goal.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Vision Statement */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Our Vision for 2030</h3>
            <p className="text-lg opacity-90 max-w-4xl mx-auto leading-relaxed">
              To become the world's most trusted and comprehensive platform for cryptocurrency project launches, 
              facilitating over $1 billion in successful token sales while maintaining our commitment to security, 
              transparency, and innovation in the decentralized finance ecosystem.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoalSection;