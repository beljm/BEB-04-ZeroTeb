import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  Pressable,
} from 'react-native'
import InnerText from '../../components/common/InnerText'
import axios, { AxiosRequestConfig } from 'axios'
import { SvgXml } from 'react-native-svg'
import { useNavigation } from '@react-navigation/native'
import { ScaledSheet } from 'react-native-size-matters'
import { getDateAndTime } from '../../utils/unixTime' 
import LoadingImg from '../../components/common/LoadingImg'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
//props: UserType

const TicketDetail = ({ route }) => {
  const navigation = useNavigation()
  const [qrSVG, setQrSVG] = useState('qr 생성 중~')
  const [tokenData, setTokenData] = useState({title: '', location: '', sub_location: '', event_start_date: undefined, event_end_date: undefined})
  const [loading, setLoading] = useState(false);

  const pressHandler = () => {
    if (qrSVG !== 'qr 생성 중~') {
      navigation.navigate('QRLoad', { qrcodeXML: qrSVG })
    }
  }

  const getEventDataByToken = async () => {
    console.log('토큰 데이터 요청')
    console.log(route.params.address, route.params.token_id)
    try {
      const config: AxiosRequestConfig = {
        method: 'get',
        url: `http://server.beeimp.com:18080/event/token?token_id=${route.params.token_id}`,
        withCredentials: true,
      }

      const res = await axios(config)
      if (res.data.message) {
        console.log(res.data.message)        
      } else {
        console.log(res.data)
        setTokenData(res.data[0])
      }
    } catch (e) {
      console.log(e)
    }
  }

  //`http://server.beeimp.com:18080/token/qrcode?address=${props.address}&token_id=${props.token_id}`
  //useEffect는 async를 사용 못함
  const getQRcode = async () => {
    console.log('qr 생성하기 요청')
    console.log(route.params.address, route.params.token_id)
    try {
      const config: AxiosRequestConfig = {
        method: 'get',
        url: `http://server.beeimp.com:18080/token/qrcode?address=${route.params.address}&token_id=${route.params.token_id}`,
        withCredentials: true,
      }

      const res = await axios(config)
      if (res.data.message) {
        console.log(res.data.message)        
      } else {
        // console.log(res.data)
        setQrSVG(res.data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  // qr 받아오기
  useEffect(() => {
    setLoading(true)
    getEventDataByToken()
    .then(()=>{
      setLoading(false)
    })
    getQRcode()//아직 미완성
  }, [])
  
  return (
    <>
      {loading ? <LoadingImg/> :
      <View style={styles.detailContainer}>        
        <InnerText innerText={'티켓은 TT에서!'} size={12} />
        <View style={styles.imgContainer}>
          <ImageBackground
            source={{ uri: route.params.token_image_url }}
            resizeMode="cover"
            style={styles.imgContent}
          />
        </View>
        <View style={styles.titleContainer}>
          <InnerText
            innerText={`${tokenData.title}`}
            size={20}
          ></InnerText>
        </View>
        <InnerText innerText={`${tokenData.location} ${tokenData.sub_location}`} size={14}></InnerText>
        { typeof tokenData.event_start_date === 'undefined' ? null : <InnerText innerText={`${getDateAndTime(tokenData.event_start_date)} ~ ${getDateAndTime(tokenData.event_end_date)}`} size={14}></InnerText>}
        <View style={styles.qrContainer}>
          <View style={styles.qrSide}>
            {qrSVG === 'qr 생성 중~' ? (
              <Text>{qrSVG}</Text>
            ) : (
              <SvgXml xml={qrSVG} width="50" height="50" />
            )}
          </View>
          <View style={styles.textSide}>
            <Pressable onPress={pressHandler}>
              <InnerText innerText={'확대하기'} size={22}></InnerText>
            </Pressable>
          </View>
        </View>
      </View>
      }
    </>
  
  )
}

const styles = ScaledSheet.create({
  detailContainer: {
    padding: '20@msr',
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  imgContainer: {
    marginTop: '2@msr',
    borderWidth: '3@msr',
    borderColor: 'black',
    borderRadius: '10@msr',
    overflow: 'hidden',
  },
  imgContent: {
    justifyContent: 'center',
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_HEIGHT * 0.48,
    overflow: 'hidden',
  },
  titleContainer: {
    margin: '8@msr',
  },
  qrContainer: {
    marginTop: '6@msr',
    flexDirection: 'row',
    borderColor: 'black',
    borderRadius: '8@msr',
    borderWidth: '1@msr',
    width: '70%',
    height: SCREEN_HEIGHT * 0.1,
  },
  qrSide: {
    width: '50%',
    borderRightWidth: '1@msr',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSide: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

// const styles = StyleSheet.create({
//     detailContainer:{
//         padding: 20,
//         backgroundColor: 'white',
//         flexDirection:'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100%',
//         width: '100%',
//     },
//     imgContainer:{
//         marginTop: 2,
//         borderWidth: 3,
//         borderColor: 'black',
//         borderRadius: 10,
//         overflow: 'hidden'
//     },
//     imgContent:{
//         justifyContent: 'center',
//         width: SCREEN_WIDTH * 0.75,
//         height: SCREEN_HEIGHT * 0.52,
//         overflow: 'hidden'
//     },
//     titleContainer:{
//         margin: 10
//     },
//     qrContainer:{
//         marginTop: 8,
//         flexDirection: 'row',
//         borderColor: 'black',
//         borderRadius: 8,
//         borderWidth: 1,
//         width: '70%',
//         height: SCREEN_HEIGHT * 0.1
//     },
//     qrSide:{
//         width: '50%',
//         borderRightWidth: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     textSide:{
//         width: '50%',
//         alignItems: 'center',
//         justifyContent: 'center',
//     }
// })

export default TicketDetail