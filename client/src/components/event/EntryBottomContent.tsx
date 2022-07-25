import * as React from 'react'
import { View, Text } from 'react-native'
import { EventType } from '../../models/Event'
import { ScaledSheet } from 'react-native-size-matters'
import Unserbar from '../../components/common/Underbar'
import EntryRefundPolicy from '../../components/event/EntryRefundPolicy'
import EntryLotPolicy from '../../components/event/EntryLotPolicy'
import EntryPrecaution from '../../components/event/EntryPrecaution'
import InnerText from '../common/InnerText'
import { getDate, getDateAndTime } from '../../utils/unixTime'
import Title from '../common/Title'
import EventImg from '../common/EventImg'

interface entryBottomContentProps {
  eventDetail: EventType
}

const EntryBottomContent: React.FC<entryBottomContentProps> = ({
  eventDetail,
}) => {
  return (
    <>
      <Unserbar />
      <Text></Text>
      <Title title={'이벤트 내용'} size={20} />
      <View style={style.eventContentContainer}>
        <InnerText innerText={eventDetail.contents} size={15} />
      </View>
      <Unserbar />
      <Text></Text>
      <Title title={'이벤트 정보'} size={20} />
      <View style={style.eventContentContainer}>
        <InnerText innerText={`- 이벤트 행사일 : `} size={20} />
        <InnerText
          innerText={`${getDate(eventDetail.event_start_date)}`}
          size={20}
        />

        <InnerText innerText={`- 티켓 응모 가능 날짜 : `} size={20} />
        <InnerText
          innerText={`${getDateAndTime(
            eventDetail.recruit_start_date,
          )} ~ ${getDateAndTime(eventDetail.recruit_start_date)}`}
          size={20}
        />
        <InnerText
          innerText={
            '* 이벤트 응모 당첨 여부는 응모 시점이 끝나면 바로 알 수 있습니다.'
          }
          size={17}
        />
      </View>
      <Unserbar />
      <Text></Text>
      <Title title={'토큰 이미지'} size={20} />
      <View style={style.eventContentContainer}>
        <EventImg
          imgUri={eventDetail.token_image_url}
          width={200}
          height={200}
        />
      </View>
      <Unserbar />
      <EntryLotPolicy />
      <Unserbar />
      <EntryPrecaution />
      <Unserbar />
      <EntryRefundPolicy />
    </>
  )
}

const style = ScaledSheet.create({
  eventContentContainer: {
    paddingVertical: '15@msr',
    paddingHorizontal: '10@msr',
  },
})

export default EntryBottomContent
