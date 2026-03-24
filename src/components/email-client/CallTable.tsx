import type { CallMetadata } from "../../types";

export function CallTable({ calls }: { calls: CallMetadata[] }) {
  return (
    <table width="100%" cellPadding="0" cellSpacing="0" class="email-table">
      <thead>
        <tr>
          <th class="col-header col-phone">Phone Number</th>
          <th class="col-header col-type">Type</th>
          <th class="col-header">Date</th>
        </tr>
      </thead>
      <tbody>
        {calls.map((call, i) => (
          <tr key={i} class="email-row">
            <td>{call.phone}</td>
            <td>{call.type}</td>
            <td>
              {new Date(call.time).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
