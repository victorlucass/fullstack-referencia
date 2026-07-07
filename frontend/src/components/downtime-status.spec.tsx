import { render } from '@testing-library/react'

import { DowntimeStatus } from './downtime-status'

describe('DowntimeStatus', () => {
  it('should render open status in amber', () => {
    const wrapper = render(<DowntimeStatus status="open" />)

    expect(wrapper.getByText('Aberta')).toBeInTheDocument()
    expect(wrapper.getByTestId('badge')).toHaveClass('bg-amber-500')
  })

  it('should render resolved status in emerald', () => {
    const wrapper = render(<DowntimeStatus status="resolved" />)

    expect(wrapper.getByText('Resolvida')).toBeInTheDocument()
    expect(wrapper.getByTestId('badge')).toHaveClass('bg-emerald-500')
  })
})
