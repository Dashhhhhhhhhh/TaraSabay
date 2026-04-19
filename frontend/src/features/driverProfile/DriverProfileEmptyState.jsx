function DriverProfileEmptyState({ onCreate }) {
  return (
    <div className="empty-state">
      <h2>No Driver Profile Found</h2>
      <p>
        No driver profile yet. You can still use TaraSabay as a passenger. If
        you also want to offer rides, set up your driver profile first.
      </p>
      <button onClick={onCreate}>Create Driver Profile</button>
    </div>
  );
}

export default DriverProfileEmptyState;
