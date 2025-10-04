import React from "react";
import { Check, Camera, Search, Zap, ImageIcon, ChevronRight } from "lucide-react";

interface UploadScreenProps {
  uploadedImage: string | null;
  dragActive: boolean;
  setDragActive: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadedImage: React.Dispatch<React.SetStateAction<string | null>>;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleImageUpload: (file: File) => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({
  uploadedImage,
  dragActive,
  setDragActive,
  setUploadedImage,
  handleDrop,
  handleImageUpload
}) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Screenshot to Solve</h2>
        <p className="text-gray-600">Upload an image and get AI-powered solutions instantly</p>
      </div>

      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : uploadedImage 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
      >
        {uploadedImage ? (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <img 
              src={uploadedImage} 
              alt="Uploaded" 
              className="max-w-full max-h-80 mx-auto rounded-xl shadow-lg"
            />
            <div className="space-y-3">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                Analyze Image
              </button>
              <button 
                onClick={() => setUploadedImage(null)}
                className="block mx-auto text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Upload different image
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <ImageIcon className="w-10 h-10 text-gray-400" />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-700 mb-2">
                {dragActive ? 'Drop your image here' : 'Upload your question image'}
              </p>
              <p className="text-gray-500">
                Drag and drop or click to select • Supports JPG, PNG, PDF
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
            >
              Choose Image
            </label>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-6">How it works</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Camera className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">1. Upload</p>
                <p className="text-sm text-gray-600">Take a photo or upload an image of your question</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">2. Analyze</p>
                <p className="text-sm text-gray-600">AI analyzes the image and identifies the problem</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">3. Solve</p>
                <p className="text-sm text-gray-600">Get step-by-step solutions and explanations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Recent Uploads</h3>
          <div className="space-y-3">
            {[
              { title: 'Algebra equation', time: '2 hours ago', color: 'blue' },
              { title: 'Chemistry formula', time: 'yesterday', color: 'green' },
              { title: 'Physics problem', time: '3 days ago', color: 'purple' }
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors`}>
                <div className={`w-10 h-10 bg-${item.color}-100 rounded-lg flex items-center justify-center`}>
                  <ImageIcon className={`w-5 h-5 text-${item.color}-600`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">Solved {item.time}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Tips for better results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            'Ensure text is clear and readable',
            'Include the complete question',
            'Good lighting and focus',
            'Avoid shadows and glare'
          ].map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadScreen;
