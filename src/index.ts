import group from './group.index'
import create from './create.index'
import unary from './unary.index'

const { assign: merge } = Object

export default merge(create, group, unary)