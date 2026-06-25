import { ArrowRight, BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { mockMetrics } from '../data';
import { motion } from 'motion/react';

export default function BentoMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {mockMetrics.map((metric, i) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          key={metric.id}
          className="p-6 rounded-3xl bg-white/80 backdrop-blur-md max-w-sm w-full mx-auto shadow-lg shadow-slate-100/70 hover:shadow-xl transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
            <BarChart3 className="w-16 h-16" />
          </div>
          
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-500 mb-1">{metric.title}</p>
            <h3 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">
              {metric.value}
            </h3>
            
            <div className="flex items-center text-sm font-medium">
              <span className={`flex items-center px-2 py-1 rounded-lg ${
                metric.trend === 'up' ? 'bg-emerald-50 text-emerald-700' :
                metric.trend === 'down' ? 'bg-rose-50 text-rose-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {metric.trend === 'up' && <TrendingUp className="w-4 h-4 mr-1" />}
                {metric.trend === 'down' && <TrendingDown className="w-4 h-4 mr-1" />}
                {metric.trend === 'neutral' && <Minus className="w-4 h-4 mr-1" />}
                {metric.percentage}
              </span>
              <span className="ml-2 text-slate-400">vs last period</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
