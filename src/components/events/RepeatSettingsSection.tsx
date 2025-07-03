import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface RepeatConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  endDate: string;
  endAfter: number;
  endType: 'date' | 'occurrences' | 'never';
}

interface RepeatSettingsSectionProps {
  repeatConfig: RepeatConfig;
  setRepeatConfig: (config: RepeatConfig) => void;
  startDate: string;
  itemVariants: any;
}

export const RepeatSettingsSection = ({
  repeatConfig,
  setRepeatConfig,
  startDate,
  itemVariants
}: RepeatSettingsSectionProps) => {
  return (
    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-5">
        <ArrowPathIcon className="h-5 w-5 text-blue-600 mr-2" />
        <h2 className="text-lg font-medium text-gray-900">Repeat Settings</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            id="enableRepeat"
            checked={repeatConfig.enabled}
            onChange={(e) => setRepeatConfig({...repeatConfig, enabled: e.target.checked})}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="enableRepeat" className="ml-2 text-sm font-medium text-gray-800">
            Repeat this event
          </label>
        </div>
        
        {repeatConfig.enabled && (
          <div className="space-y-4 pl-6 border-l-2 border-blue-200 bg-blue-50 p-4 rounded-lg">
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Repeat Frequency
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRepeatConfig({...repeatConfig, frequency: 'daily'})}
                  className={`px-3 py-2 text-center border rounded-md transition-colors ${
                    repeatConfig.frequency === 'daily'
                      ? 'border-blue-500 bg-blue-100 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="text-sm font-medium">Daily</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRepeatConfig({...repeatConfig, frequency: 'weekly'})}
                  className={`px-3 py-2 text-center border rounded-md transition-colors ${
                    repeatConfig.frequency === 'weekly'
                      ? 'border-blue-500 bg-blue-100 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="text-sm font-medium">Weekly</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRepeatConfig({...repeatConfig, frequency: 'monthly'})}
                  className={`px-3 py-2 text-center border rounded-md transition-colors ${
                    repeatConfig.frequency === 'monthly'
                      ? 'border-blue-500 bg-blue-100 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="text-sm font-medium">Monthly</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                End repeat
              </label>
              <div className="space-y-3 bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <input
                    type="radio"
                    id="endNever"
                    name="endType"
                    value="never"
                    checked={repeatConfig.endType === 'never'}
                    onChange={(e) => setRepeatConfig({...repeatConfig, endType: 'never'})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="endNever" className="ml-2 text-sm text-gray-700 font-medium">
                    Never
                  </label>
                </div>
                
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <input
                    type="radio"
                    id="endAfter"
                    name="endType"
                    value="occurrences"
                    checked={repeatConfig.endType === 'occurrences'}
                    onChange={(e) => setRepeatConfig({...repeatConfig, endType: 'occurrences'})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="endAfter" className="text-sm text-gray-700 font-medium">
                    After
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={repeatConfig.endAfter}
                    onChange={(e) => setRepeatConfig({...repeatConfig, endAfter: parseInt(e.target.value)})}
                    disabled={repeatConfig.endType !== 'occurrences'}
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors disabled:bg-gray-100"
                  />
                  <span className="text-sm text-gray-700">occurrences</span>
                </div>
                
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <input
                    type="radio"
                    id="endOn"
                    name="endType"
                    value="date"
                    checked={repeatConfig.endType === 'date'}
                    onChange={(e) => setRepeatConfig({...repeatConfig, endType: 'date'})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="endOn" className="text-sm text-gray-700 font-medium">
                    On
                  </label>
                  <input
                    type="date"
                    value={repeatConfig.endDate}
                    onChange={(e) => setRepeatConfig({...repeatConfig, endDate: e.target.value})}
                    disabled={repeatConfig.endType !== 'date'}
                    min={startDate}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}; 