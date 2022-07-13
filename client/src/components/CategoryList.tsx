import * as React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native'
import { CategoryData } from '../data/CategoryData'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const DATA = CategoryData

export default function CategoryList() {
  return (
    <View style={style.categoryListOuterContainer}>
      {DATA.map(category => {
        return (
          <View key={category.id} style={style.categoryListInnerContainer}>
            <ImageBackground
              source={{ uri: category.image }}
              resizeMode="cover"
              style={style.categoryImg}
            >
              <Text style={style.categoryText}>{category.title}</Text>
            </ImageBackground>
          </View>
        )
      })}
    </View>
  )
}

const style = StyleSheet.create({
  categoryListOuterContainer: {
    flex: 1,
    alignItems: 'flex-start',
    margin: 20,
  },
  categoryListInnerContainer: {
    flex: 1,
    paddingBottom: 20,
    borderRadius: 10,
  },
  categoryImg: {
    width: SCREEN_WIDTH * 0.9,
    height: 80,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  categoryText: {
    color: 'white',
    fontSize: 30,
  },
})