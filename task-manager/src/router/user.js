const express = require('express')
const User = require('./../models/User')

const router = new express.Router()

router.get('/users', async (req, res) => {
    const users = await User.find({})
    try {
			res.status(201).send(users)
    } catch (err) {
			res.status(500).send(err)
		}
})

router.get('/users/:id', async (req, res) => {
    try {
			const user = await User.findById(req.params.id)
			if (!user) {
				return res.status(404).send()
			}
			res.status(201).send(user)
    } catch (err) {
			res.status(500).send(err)
		}
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
		try {
			await user.save()
			res.status(201).send(user)
    } catch (err) {
			res.status(400).send(err)
		}
})

router.patch('/users/:id', async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
		if (!user) {
			return res.status(404).send()
		}
		res.send(user)
	} catch (err) {
		res.status(400).send(err)
	}
})

router.delete('/users/:id', async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id)
		if (!user) {
			return res.status(404).send()
		}
		res.send(user)
	} catch (err) {
		res.status(500).send(err)
	}
})

module.exports = router