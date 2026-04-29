function DriverProfileEmptyState({ onCreate }) {
  return (
    <section className="empty-state">
      <h2>No Driver Profile Found</h2>
      <p>
        No driver profile yet. You can still use TaraSabay as a passenger. If
        you also want to offer rides, set up your driver profile first.
      </p>

      <button type="button" className="btn btn-primary" onClick={onCreate}>
        Create Driver Profile
      </button>
    </section>
  );
}

export default DriverProfileEmptyState;
