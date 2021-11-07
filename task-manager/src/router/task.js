const express = require('express')
const Task = require('./../models/Task')
const auth = require('./../middleware/auth')

const router = new express.Router()

router.get('/tasks', auth, async (req, res) => {
	try {
		// const tasks = await Task.find({ owner: req.user._id })
		await req.user.populate('tasks')
		res.status(201).send(req.user.tasks)
	} catch (err) {
		console.log(err)
		res.status(500).send(err)
	}
})

router.get('/tasks/:id', auth, async (req, res) => {
	try {
		// const task = await Task.findById(req.params.id)
		const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
		if (!task) {
			return res.status(404).send()
		}
		res.status(201).send(task)
	} catch (err) {
		res.status(500).send(err)
	}
})

router.post('/tasks', auth, async (req, res) => {
	const task = new Task({
		...req.body,
		owner: req.user._id
	})
		try {
			await task.save()
			res.status(201).send(task)
    } catch (err) {
			res.status(400).send(err)
		}
})

router.patch('/tasks/:id', auth, async (req, res) => {
	try {
		const allowedKeysToUpdate = ['completed']
		const reqKeys = Object.keys(req.body)
		const isValidOperation = reqKeys.every((allowedKey) => allowedKeysToUpdate.includes(allowedKey))
		if (!isValidOperation) {
			return res.status(404).send({ error: 'Invalid updates' })
		}
		const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
		if (!task) {
			return res.status(404).send()
		}
		reqKeys.forEach((key) => task[key] = req.body[key])
		await task.save()
		if (!task) {
			return res.status(404).send()
		}
		res.send(task)
	} catch (err) {
		res.status(400).send(err)
	}
})

router.delete('/tasks/:id', auth, async (req, res) => {
	try {
		const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

		// const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
		// task.remove()

		if (!task) {
			return res.status(404).send()
		}
		res.send(task)
	} catch (err) {
		res.status(500).send(err)
	}
})

module.exports = router