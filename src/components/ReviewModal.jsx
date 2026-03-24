import { useState, useRef } from 'react';
import { X, Star, Camera, CheckCircle, Loader2 } from 'lucide-react';

export default function ReviewModal({ isOpen, onClose, product }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState([
    "https://picsum.photos/seed/photo1/200/200",
    "https://picsum.photos/seed/photo2/200/200"
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPhotos = files.map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please provide a rating before submitting.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Close modal and reset state after showing success message
      setTimeout(() => {
        onClose();
        setTimeout(() => {
          setIsSubmitted(false);
          setRating(0);
          setReviewText('');
          setPhotos([
            "https://picsum.photos/seed/photo1/200/200",
            "https://picsum.photos/seed/photo2/200/200"
          ]);
        }, 300);
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-[480px] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center p-10 text-center h-64">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Review Submitted!</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Thank you for sharing your experience.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Write a Review</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 pb-2 overflow-y-auto flex-1 space-y-6">
              {/* Product Info */}
              <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <img 
                  src={product?.image || "https://picsum.photos/seed/headphones/100/100"} 
                  alt="Product" 
                  className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700" 
                />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{product?.name || "Premium Headphones"}</h3>
                  <p className="text-xs text-slate-500">{product?.variant || "Space Gray"}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 dark:text-white">Overall Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating) 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'fill-slate-100 text-slate-200 dark:fill-slate-800 dark:text-slate-700'
                        } transition-colors`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 dark:text-white">Share your experience</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="What did you like or dislike about this product? Share your experience..."
                  className="w-full h-32 p-4 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-none transition-all placeholder:text-slate-400"
                ></textarea>
              </div>

              {/* Add Photos */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 dark:text-white">Add Photos</label>
                <div className="flex flex-wrap gap-3">
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handlePhotoUpload} 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-[160px] h-24 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-500"
                  >
                    <Camera className="w-5 h-5 mb-2 text-slate-400" />
                    <span className="text-[11px] text-center px-4 text-slate-500">Click to upload photos or drag and drop</span>
                  </button>
                  
                  {/* Uploaded photos */}
                  {photos.map((photo, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img src={photo} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-1.5 right-1.5 w-5 h-5 bg-slate-900/70 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors shadow-sm backdrop-blur-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 flex flex-col gap-3">
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
              <button 
                onClick={onClose} 
                disabled={isSubmitting}
                className="w-full py-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
