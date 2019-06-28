import 'dotenv/config'
import Bee from 'bee-queue'
import CancelationMail from '../app/jobs/CancelationMail'
import redisConfig from '../config/redis'

const jobs = [CancelationMail]

class Queue {
  constructor() {
    this.queues = {}

    this.init()
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      }
    })
  }

  createJob(queue, job) {
    return this.queues[queue].bee.createJob(job).save()
  }

  process() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key]

      bee.on('failure', this.onFailure).process(handle)
    })
  }

  onFailure(job, error) {
    // eslint-disable-next-line no-console
    console.log(`Queue ${job.queue.name} FAILED:`, error)
  }
}

export default new Queue()
