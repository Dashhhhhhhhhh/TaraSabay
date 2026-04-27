function ReportList({ reports, onViewReport }) {
  const getReportContext = (report) => {
    if (report.reported_user_id) return "User";
    if (report.ride_offer_id) return "Ride Offer";
    if (report.ride_request_id) return "Ride Request";
    if (report.message_id) return "Message";
    return "-";
  };

  return (
    <table className="my-reports-list">
      <thead>
        <tr>
          <th>Target</th>
          <th>Reason</th>
          <th>Details</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((rep) => (
          <tr key={rep.report_id}>
            <td>{getReportContext(rep)}</td>
            <td>{rep.reason}</td>
            <td>{rep.details || "-"}</td>
            <td>{rep.status}</td>
            <td>{new Date(rep.created_at).toLocaleString()}</td>
            <td>
              <button type="button" onClick={() => onViewReport?.(rep)}>
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ReportList;
