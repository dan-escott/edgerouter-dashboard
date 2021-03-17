import { Configuration } from './Configuration'
import sampleData from './Configuration.test.json'

// /api/edge/data.json?data=
// dhcp_leases
// dhcp_stats
// routes          routing table
// sys_info        versions

// ip addresses - in interface stats

it('should load sample data', () => {
  const parsedData: Configuration = sampleData
  expect(parsedData).toBeTruthy()
})
