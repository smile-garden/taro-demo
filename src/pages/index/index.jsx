import { getWindowHeight } from '@utils/style'
import { Loading } from '@components'
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as actions from '../../actions/home'
import Clock from './clock'
import SearchInput from './search'
import Banner from './banner'
import Policy from './policy'
import Pin from './pin'
import Recommend from './recommend'
import './index.scss'

const RECOMMEND_SIZE = 20

@connect(state => state.home, { ...actions })
export default class Home extends Component {
  state = {
    loaded: false,
    loading: false,
    lastItemId: 0,
    hasMore: true
  }

  componentDidMount() {
    Taro.showToast({
      title: '欢迎回来',
      icon: 'none',
      duration: 3000
    })

    this.props.dispatchHome().then(() => {
      this.setState({ loaded: true })
    })
    this.props.dispatchSearchCount().then(() => {
      console.log('调用成功了')
    });
    this.props.dispatchPin({ orderType: 4, size: 12})
    this.loadRecommend()
  }

  config = {
    navigationBarTitleText: '首页'
  }

  loadRecommend = () => {
    if (!this.state.hasMore || this.state.loading) {
      return
    }
    
    const payload = {
      lastItemId: this.state.lastItemId,
      size: RECOMMEND_SIZE
    }
    this.setState({ loading: true })
    this.props.dispatchRecommend(payload).then((res) => {
      const lastItem = res.rcmdItemList[res.rcmdItemList.length - 1]
      this.setState({
        loading: false,
        hasMore: res.hasMore,
        lastItemId: lastItem && lastItem.id
      })
    }).catch(() => {
      this.setState({ loading: false })
    })
  }

  render () {
    if (!this.state.loaded) {
      return <Loading loaded />
    }

    const { homeInfo, searchCount, pin, recommend } = this.props
    return (
      <View className='home'>
        <Clock />
        <SearchInput count={searchCount} />
        <ScrollView
          scrollY
          className='home__wrap'
          onScrollToLower={this.loadRecommend}
          style={{ height: getWindowHeight() }}>
          <Banner list={homeInfo.focus} />
          <Policy list={homeInfo.policyDesc} />
          <Pin
            banner={homeInfo.newUserExclusive}
            list={pin}
          />
          <Recommend list={recommend} />
        </ScrollView>
        {this.state.loading && <Loading loading={true} />}
        {!this.state.hasMore && <Loading hasMore={true} />}
      </View>
    )
  }
}
