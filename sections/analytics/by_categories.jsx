import tw from 'twin.macro'

import { Table } from '../../components'
import { useConfig } from '../../context'
import { useSubscription } from '@apollo/react-hooks'
import { SUM_BY_CATEGORIES } from '../../graphql'

export const ByCategories = () => {
   const { methods } = useConfig()
   const { loading, data: { sumByCategory = {} } = {} } = useSubscription(
      SUM_BY_CATEGORIES
   )
   const [columns] = React.useState([
      {
         key: 'Category',
         type: 'String',
      },
      {
         key: 'Total Amount',
         type: 'Number',
      },
      {
         key: 'Expenses Count',
         type: 'Number',
      },
   ])

   return (
      <Table>
         <Table.Head>
            <Table.Row>
               {columns.map((column, index) => (
                  <Table.Cell as="th" key={index} type={column.type}>
                     {column.key}
                  </Table.Cell>
               ))}
            </Table.Row>
         </Table.Head>
         {loading ? (
            <Table.Body>
               {[false, true, false, true, false].map((node, index) => (
                  <Table.Row isEven={node} key={index}>
                     <Table.Cell as="td" />
                     <Table.Cell as="td" />
                     <Table.Cell as="td" />
                  </Table.Row>
               ))}
            </Table.Body>
         ) : (
            <Table.Body>
               {sumByCategory?.aggregate?.count > 0 ? (
                  sumByCategory.nodes.map((category, index) => (
                     <Table.Row key={index} isEven={(index & 1) === 1}>
                        <Table.Cell as="td">{category.title}</Table.Cell>
                        <Table.Cell as="td" align="right">
                           <span tw="font-medium text-red-600">
                              - {methods.format_currency(category.amount)}
                           </span>
                        </Table.Cell>
                        <Table.Cell as="td" align="right">
                           {category.count}
                        </Table.Cell>
                     </Table.Row>
                  ))
               ) : (
                  <h3 tw="text-center my-3">No data</h3>
               )}
            </Table.Body>
         )}
      </Table>
   )
}
