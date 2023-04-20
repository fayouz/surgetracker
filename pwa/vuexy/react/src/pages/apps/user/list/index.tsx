// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from "react-redux"

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { CardStatsType } from 'src/@fake-db/types'
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'
import { CardStatsHorizontalWithDetailsProps } from 'src/@core/components/card-statistics/types'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'

import i18n from "../../../../configs/i18n";
import i18next from "i18next";
interface UserRoleType {
  [key: string]: { icon: string; color: string }
}

interface UserStatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: UsersType
}

// ** renders client column
const userRoleObj: UserRoleType = {
  admin: { icon: 'tabler:device-laptop', color: 'secondary' },
  user: { icon: 'tabler:user', color: 'secondary' }
}

const userStatusObj: UserStatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// ** renders client column
const renderClient = (row: UsersType) => {
  let fullname = row?.firstname + ' ' + row?.lastname;
  return (
      <CustomAvatar
          skin='light'
          sx={{ mr: 2.5, width: 38, height: 38, fontSize: '1rem', fontWeight: 500 }}
      >
        {getInitials(fullname || 'John Doe')}
      </CustomAvatar>
  )
}

const RowOptions = ({ id }: { id: number | string }) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    dispatch(deleteUser(id))
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href='/apps/user/view/account'
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

const columns: GridColDef[] = [
  {
    flex: 0.25,
    minWidth: 280,
    field: 'lastname',
    headerName: 'User',
    renderCell: ({ row }: CellType) => {
      const { firstname, lastname, email } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              component={Link}
              href='/apps/user/view/account'
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {firstname} {lastname}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {email}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'role',
    minWidth: 170,
    headerName: 'Role',
    renderCell: ({ row }: CellType) => {
      let role = row.roles[0].replace('ROLE_','').toLowerCase()
      let roleFirstLetter = role.charAt(0).toUpperCase() + role.slice(1);
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar
            skin='light'
            sx={{ mr: 4, width: 30, height: 30 }}
            color={(userRoleObj[role].color as ThemeColor) || 'primary'}
          >
            <Icon icon={userRoleObj[role].icon} />
          </CustomAvatar>

          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {i18n.t((roleFirstLetter ?? 'User'))}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
  }
]

const UserList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** State
  const [role, setRole] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.user)

  useEffect(() => {

    let params = {
      roles:role,
      status
    }

    if(value) {
      params = Object.assign(params, {
        firstname: value,
        lastname: value,
        email: value
      })
    }

    dispatch(
      fetchData(params)
    )
  }, [dispatch, role, status, value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleRoleChange = useCallback((e: SelectChangeEvent) => {
    setRole(e.target.value)
  }, [])


  const handleStatusChange = useCallback((e: SelectChangeEvent) => {
    setStatus(e.target.value)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontalWithDetails.map((item: CardStatsHorizontalWithDetailsProps, index: number) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatsHorizontalWithDetails {...item} />
                </Grid>
              )
            })}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='role-select'>Select Role</InputLabel>
                  <Select
                    fullWidth
                    value={role}
                    id='select-role'
                    label='Select Role'
                    labelId='role-select'
                    onChange={handleRoleChange}
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    <MenuItem value=''>Select Role</MenuItem>
                    <MenuItem value='admin'>Admin</MenuItem>
                    <MenuItem value='user'>User</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='status-select'>Select Status</InputLabel>
                  <Select
                    fullWidth
                    value={status}
                    id='select-status'
                    label='Select Status'
                    labelId='status-select'
                    onChange={handleStatusChange}
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    <MenuItem value=''>Select Role</MenuItem>
                    <MenuItem value='pending'>Pending</MenuItem>
                    <MenuItem value='active'>Active</MenuItem>
                    <MenuItem value='inactive'>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={store.data}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}


const cardStatsData: CardStatsType = {
  statsSquare: [
    {
      stats: '97.8k',
      title: 'Orders',
      avatarColor: 'error',
      icon: 'tabler:briefcase'
    },
    {
      stats: '3.4k',
      title: 'Review',
      avatarColor: 'success',
      icon: 'tabler:message-dots'
    }
  ],
  statsHorizontal: [
    {
      stats: '86%',
      icon: 'tabler:cpu',
      title: 'CPU Usage'
    },
    {
      stats: '1.24gb',
      icon: 'tabler:server',
      title: 'Memory Usage',
      avatarColor: 'success'
    },
    {
      stats: '0.2%',
      avatarColor: 'error',
      title: 'Downtime Ratio',
      icon: 'tabler:chart-pie-2'
    },
    {
      stats: '128',
      title: 'Issues Found',
      avatarColor: 'warning',
      icon: 'tabler:alert-octagon'
    }
  ],
  statsVertical: [
    {
      stats: '1.28k',
      chipColor: 'error',
      chipText: '-12.2%',
      avatarColor: 'error',
      title: 'Total Profit',
      subtitle: 'Last week',
      avatarIcon: 'tabler:credit-card'
    },
    {
      stats: '24.67k',
      chipText: '+25.7%',
      title: 'Total Sales',
      chipColor: 'success',
      subtitle: 'Last week',
      avatarColor: 'success',
      avatarIcon: 'tabler:credit-card'
    }
  ],
  statsWithAreaChart: [
    {
      stats: '92.6k',
      avatarIcon: 'tabler:users',
      title: 'Subscribers Gained',
      chartSeries: [{ data: [40, 4, 58, 12, 35, 10, 84] }]
    },
    {
      stats: '36.5%',
      chartColor: 'error',
      avatarColor: 'error',
      title: 'Quarterly Sales',
      avatarIcon: 'tabler:shopping-cart',
      chartSeries: [{ data: [44, 75, 24, 57, 6, 84] }]
    },
    {
      stats: '97.5k',
      chartColor: 'warning',
      avatarColor: 'warning',
      title: 'Orders Received',
      avatarIcon: 'tabler:package',
      chartSeries: [{ data: [30, 84, 11, 76, 0, 49, 9] }]
    },
    {
      stats: '91.8k',
      chartColor: 'success',
      avatarColor: 'success',
      title: 'Revenue Generated',
      avatarIcon: 'tabler:credit-card',
      chartSeries: [{ data: [6, 35, 25, 61, 32, 84, 70] }]
    }
  ],
  statsHorizontalWithDetails: [
    {
      stats: '21,459',
      title: 'Session',
      trendDiff: '+29',
      icon: 'tabler:user',
      subtitle: 'Total Users'
    },
    {
      stats: '4,567',
      trendDiff: '+18',
      title: 'Paid Users',
      avatarColor: 'error',
      icon: 'tabler:user-plus',
      subtitle: 'Last week analytics'
    },
    {
      stats: '19,860',
      trendDiff: '-14',
      trend: 'negative',
      title: 'Active Users',
      avatarColor: 'success',
      icon: 'tabler:user-check',
      subtitle: 'Last week analytics'
    },
    {
      stats: '237',
      trendDiff: '+42',
      title: 'Pending Users',
      avatarColor: 'warning',
      icon: 'tabler:user-exclamation',
      subtitle: 'Last week analytics'
    }
  ]
}
export const getStaticProps: GetStaticProps = async () => {
  //const res = await axios.get('/cards/statistics')
  //const apiData: CardStatsType = res.data

  return {
    props: {
      cardStatsData
    }
  }
}

export default UserList
