import group from './group.index.ts'
import create from './create.index.ts'
import unary from './unary.index.ts'

const { assign: merge } = Object

export default merge({}, create, group, unary)