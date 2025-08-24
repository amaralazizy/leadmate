export default function WaitlistSocialProof() {
  return (
    <div className="mb-12">
      <div className="flex justify-center items-center mb-4">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-full border-3 border-black shadow-lg flex items-center justify-center bg-accent-green"
            >
              <span className="font-bold text-sm text-dark-bg">
                {String.fromCharCode(65 + i)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-lg font-medium text-text-light">
        Join the <span className="font-bold text-accent-green">2,000+</span>{" "}
        members who have already signed up
      </p>
    </div>
  );
}
